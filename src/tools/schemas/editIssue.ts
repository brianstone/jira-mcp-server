import { z } from 'zod';
import { apiKey } from '../../utils/utils';

type JiraFieldSchema = {
  id: string;
  name: string;
  schema: {
    type: string;
    items?: string;
    custom?: string;
  };
};

async function getAllJiraFields(): Promise<JiraFieldSchema[]> {
  const response = await fetch(`${process.env.JIRA_PROJECT_URL}/rest/api/3/field`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  return data;
}

export function findFieldsByName(
  fields: JiraFieldSchema[],
  names: string[]
): JiraFieldSchema[] | undefined {
  const lowerNames = names.map((name) => name.toLowerCase());
  const foundFields = fields.filter((field) => lowerNames.includes(field.name.toLowerCase()));

  if (foundFields.length === 0) {
    return undefined;
  }

  return foundFields;
}

type FieldOperationSchema = Partial<{
  set: z.ZodTypeAny;
  add: z.ZodTypeAny;
  remove: z.ZodTypeAny;
}>;

const fieldOperationMap: Record<string, FieldOperationSchema> = {
  string: {
    set: z.string(),
  },
  number: {
    set: z.number(),
  },
  boolean: {
    set: z.boolean(),
  },
  datetime: {
    set: z.string().datetime(),
  },
  user: {
    set: z.union([z.object({ accountId: z.string() }), z.literal('-1')]),
  },
  array_user: {
    set: z.object({ accountId: z.string() }),
    add: z.object({ accountId: z.string() }),
    remove: z.object({ accountId: z.string() }),
  },
  array_default: {
    set: z.union([z.string(), z.number()]),
    add: z.union([z.string(), z.number()]),
    remove: z.union([z.string(), z.number()]),
  },
};

function getZodType(field: JiraFieldSchema, op: 'set' | 'add' | 'remove'): z.ZodTypeAny {
  const { type, items } = field.schema;

  if (type === 'array') {
    if (items === 'user') {
      return fieldOperationMap['array_user'][op] ?? z.never();
    }

    return fieldOperationMap['array_default'][op] ?? z.never();
  }

  if (type in fieldOperationMap) {
    return fieldOperationMap[type][op] ?? z.never();
  }

  return z.any();
}

export function updateSchema(fields: JiraFieldSchema[]) {
  const updateFields: Record<string, any> = {};

  fields.forEach((field) => {
    const possibleOperations: z.ZodTypeAny[] = [];

    for (const op of ['set', 'add', 'remove'] as const) {
      const zodType = getZodType(field, op);

      if (zodType.constructor !== z.ZodNever) {
        possibleOperations.push(z.object({ [op]: zodType }));
      }
    }

    if (possibleOperations.length === 0) {
      updateFields[field.id] = z.array(z.never());
    } else if (possibleOperations.length === 1) {
      updateFields[field.id] = z.array(possibleOperations[0]);
    } else {
      updateFields[field.id] = z.array(
        z.union(possibleOperations as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]])
      );
    }
  });

  return z.object({
    update: z.object(updateFields),
  });
}

export async function updatePayload(
  fieldNames: { fieldName: string; operation: string; value: any }[]
) {
  const allFields = await getAllJiraFields();
  const fieldsToSearch = fieldNames.map((field) => field.fieldName);
  const fieldsToUpdate = findFieldsByName(allFields, fieldsToSearch);

  if (!fieldsToUpdate) {
    return;
  }

  const fieldSchema = updateSchema(fieldsToUpdate);

  const updateFields: Record<string, any> = {};

  if (!fieldsToUpdate) {
    return;
  }

  fieldNames?.forEach((field) => {
    const updateField = fieldsToUpdate.find(
      (f) => f.name.toLowerCase() === field.fieldName.toLowerCase()
    );

    if (!updateField) {
      return;
    }

    if (!updateFields[updateField.id]) {
      updateFields[updateField.id] = [];
    }

    let operationObject;

    if (updateField.schema.type === 'string' || updateField.schema.type === 'number') {
      operationObject = { [field.operation]: field.value };
    } else if (updateField.schema.type === 'array') {
      if (updateField.schema.items === 'user') {
        operationObject = { [field.operation]: { accountId: field.value } };
      } else {
        operationObject = { [field.operation]: field.value };
      }
    } else if (updateField.schema.type === 'user') {
      if (!field.value) {
        operationObject = { set: '-1' };
      } else {
        operationObject = { [field.operation]: { accountId: field.value } };
      }
    }

    if (operationObject) {
      updateFields[updateField.id].push(operationObject);
    }
  });

  const payload = fieldSchema.safeParse({ update: updateFields });

  if (!payload.success) {
    return;
  }

  return payload.data;
}

export const editIssueSchema = z.object({
  issueKey: z.string(),
  fieldsToUpdate: z.array(
    z.object({
      fieldName: z.string(),
      operation: z.union([z.literal('set'), z.literal('add'), z.literal('remove')]),
      value: z.union([z.string(), z.number()]),
    })
  ),
});
