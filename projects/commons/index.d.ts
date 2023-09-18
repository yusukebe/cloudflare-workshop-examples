/// <reference types="@cloudflare/workers-types" />
import { z } from 'zod';
export declare const schema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
}, {
    title: string;
    content: string;
}>;
export type Bindings = {
    DB: D1Database;
};
export type Post = z.infer<typeof schema> & {
    created_at: string;
    id: string;
};
