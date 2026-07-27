import { AdminShell } from '@/components/admin/admin-shell';
import { MarkdownEditor } from '@/features/blog-editor/markdown-editor';

export default function Page() { return <AdminShell title="Blog"><MarkdownEditor /></AdminShell>; }
