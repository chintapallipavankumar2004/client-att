import { ADMIN_COLLECTION_PERMISSIONS } from '../../src/shared/adminAccess';
import { readJsonBody, sendJson } from '../_lib/http';
import { recordAuditLog, requireAdminSession, SessionError } from '../_lib/session';
import {
  createCollectionDocument,
  deleteCollectionDocument,
  replaceCollectionDocuments,
  upsertCollectionDocument,
} from '../_lib/store';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { message: 'Method not allowed.' });
    return;
  }

  try {
    const body = await readJsonBody<{
      collection?: keyof typeof ADMIN_COLLECTION_PERMISSIONS;
      action?: 'create' | 'update' | 'delete' | 'replaceCollection';
      documentId?: string;
      data?: Record<string, unknown>;
      documents?: Array<Record<string, unknown>>;
    }>(req);

    const collection = body.collection;
    const action = body.action;

    if (!collection || !action || !(collection in ADMIN_COLLECTION_PERMISSIONS)) {
      sendJson(res, 400, { message: 'Invalid content mutation request.' });
      return;
    }

    const permission = ADMIN_COLLECTION_PERMISSIONS[collection];
    const session = await requireAdminSession(req, permission);

    if (action === 'replaceCollection') {
      const documents = Array.isArray(body.documents) ? body.documents : [];
      const nextDocuments = documents.filter((document): document is Record<string, unknown> & { id: string } =>
        typeof document.id === 'string' && document.id.length > 0,
      );

      const saved = await replaceCollectionDocuments(collection, nextDocuments);

      await recordAuditLog({
        action: `admin_${collection}_replace_collection`,
        uid: session.admin.uid,
        email: session.admin.email,
        role: session.admin.role,
        metadata: {
          collection,
          count: saved.length,
        },
      });

      sendJson(res, 200, { message: 'Collection updated successfully.', documents: saved });
      return;
    }

    if (action === 'delete') {
      if (!body.documentId) {
        sendJson(res, 400, { message: 'A document id is required.' });
        return;
      }

      await deleteCollectionDocument(collection, body.documentId);
      await recordAuditLog({
        action: `admin_${collection}_delete`,
        uid: session.admin.uid,
        email: session.admin.email,
        role: session.admin.role,
        metadata: {
          collection,
          documentId: body.documentId,
        },
      });

      sendJson(res, 200, { message: 'Document deleted successfully.' });
      return;
    }

    const documentData = body.data || {};

    if (action === 'create') {
      const created = await createCollectionDocument(collection, documentData, body.documentId);
      await recordAuditLog({
        action: `admin_${collection}_create`,
        uid: session.admin.uid,
        email: session.admin.email,
        role: session.admin.role,
        metadata: {
          collection,
          documentId: created.id,
        },
      });

      sendJson(res, 201, { message: 'Document created successfully.', document: created });
      return;
    }

    if (!body.documentId) {
      sendJson(res, 400, { message: 'A document id is required.' });
      return;
    }

    const updated = await upsertCollectionDocument(collection, body.documentId, documentData);
    await recordAuditLog({
      action: `admin_${collection}_update`,
      uid: session.admin.uid,
      email: session.admin.email,
      role: session.admin.role,
      metadata: {
        collection,
        documentId: updated.id,
      },
    });

    sendJson(res, 200, { message: 'Document updated successfully.', document: updated });
  } catch (error) {
    if (error instanceof SessionError) {
      sendJson(res, error.status, { message: error.message });
      return;
    }

    console.error('Failed to mutate admin content', error);
    sendJson(res, 500, { message: 'Unable to save your changes right now.' });
  }
}
