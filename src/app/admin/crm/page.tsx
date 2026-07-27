import { AdminShell } from '@/components/admin/admin-shell';
import { KanbanBoard } from '@/features/crm/kanban-board';
export default function Page() { return <AdminShell title="CRM Pipeline"><KanbanBoard /></AdminShell>; }
