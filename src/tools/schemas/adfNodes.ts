import { LANGUAGES } from './languages';
import {
  backgroundColorMark,
  codeMark,
  emMark,
  linkMark,
  strikeMark,
  strongMark,
  subsupMark,
  textColorMark,
  underlineMark,
} from './adfMarks';
import { z } from 'zod';

export const adfDocParagraph = z.object({
  type: z.literal('paragraph'),
  content: z.array(
    z.object({
      type: z.string().default('text'),
      text: z.string(),
      marks: z.array(
        z
          .discriminatedUnion('type', [
            backgroundColorMark,
            codeMark,
            emMark,
            linkMark,
            strikeMark,
            strongMark,
            subsupMark,
            textColorMark,
            underlineMark,
          ])
          .optional()
      ),
    })
  ),
});

export const adfDocHeading = z.object({
  type: z.literal('heading'),
  attrs: z.object({
    level: z.number(),
  }),
  content: z.array(
    z.object({
      type: z.string().default('text'),
      text: z.string(),
      marks: z.array(
        z
          .discriminatedUnion('type', [
            backgroundColorMark,
            codeMark,
            emMark,
            linkMark,
            strikeMark,
            strongMark,
            subsupMark,
            textColorMark,
            underlineMark,
          ])
          .optional()
      ),
    })
  ),
});

export const adfBulletList = z.object({
  type: z.literal('bulletList'),
  content: z.array(
    z.object({
      type: z.string().default('listItem'),
      content: z.array(
        z.object({
          type: z.string().default('paragraph'),
          content: z.array(
            z.object({
              type: z.string().default('text'),
              text: z.string(),
              marks: z.array(
                z
                  .discriminatedUnion('type', [
                    backgroundColorMark,
                    codeMark,
                    emMark,
                    linkMark,
                    strikeMark,
                    strongMark,
                    subsupMark,
                    textColorMark,
                    underlineMark,
                  ])
                  .optional()
              ),
            })
          ),
        })
      ),
    })
  ),
});

export const adfOrderedList = z.object({
  type: z.literal('orderedList'),
  attrs: z.object({
    order: z.number().min(0).describe('The number of the first item in the list'),
  }),
  content: z.array(
    z.object({
      type: z.string().default('listItem'),
      content: z.array(
        z.object({
          type: z.string().default('paragraph'),
          content: z.array(
            z.object({
              type: z.string().default('text'),
              text: z.string(),
              marks: z.array(
                z
                  .discriminatedUnion('type', [
                    backgroundColorMark,
                    codeMark,
                    emMark,
                    linkMark,
                    strikeMark,
                    strongMark,
                    subsupMark,
                    textColorMark,
                    underlineMark,
                  ])
                  .optional()
              ),
            })
          ),
        })
      ),
    })
  ),
});

export const adfCodeBlock = z.object({
  type: z.literal('codeBlock'),
  attrs: z.object({
    language: z.enum(LANGUAGES),
  }),
  content: z.array(
    z.object({
      type: z.string().default('text'),
      text: z.string(),
    })
  ),
});

export const adfBlockQuote = z.object({
  type: z.literal('blockquote'),
  content: z.array(
    z.object({
      type: z.string().default('text'),
      text: z.string(),
      marks: z.array(
        z
          .discriminatedUnion('type', [
            backgroundColorMark,
            codeMark,
            emMark,
            linkMark,
            strikeMark,
            strongMark,
            subsupMark,
            textColorMark,
            underlineMark,
          ])
          .optional()
      ),
    })
  ),
});
