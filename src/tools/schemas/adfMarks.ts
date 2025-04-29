import { z } from 'zod';

export const backgroundColorMark = z.object({
  type: z.literal('backgroundColor'),
  attrs: z.object({
    color: z.string().describe('Hexadecimal color code'),
  }),
});

export const codeMark = z.object({
  type: z.literal('code'),
});

export const emMark = z.object({
  type: z.literal('em'),
});

export const linkMark = z.object({
  type: z.literal('link'),
  attrs: z.object({
    href: z.string(),
    title: z.string(),
  }),
});

export const strikeMark = z.object({
  type: z.literal('strike'),
});

export const strongMark = z.object({
  type: z.literal('strong'),
});

export const subsupMark = z.object({
  type: z.literal('subsup'),
  attrs: z.object({
    type: z.literal('sub').or(z.literal('sup')),
  }),
});

export const textColorMark = z.object({
  type: z.literal('textColor'),
  attrs: z.object({
    color: z.string().describe('Hexadecimal color code'),
  }),
});

export const underlineMark = z.object({
  type: z.literal('underline'),
});
