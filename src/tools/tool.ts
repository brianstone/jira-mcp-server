import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { JsonSchema7Type } from 'zod-to-json-schema';

export type ToolSchema = {
  name: string;
  description: string;
  inputSchema: JsonSchema7Type;
};

export type Tool = {
  schema: ToolSchema;
  handle: (params?: Record<string, any>) => Promise<CallToolResult | null>;
};
