# n8n Clone - Changes Documentation

## Overview
This document summarizes all changes made to connect the frontend and backend, complete the n8n-like workflow automation app, and enhance the UI/UX.

---

## Backend Changes

### Models (`models/workflow.py`)
- Added `webhook_path` field (unique path for each workflow webhook)
- Added `created_at`, `updated_at`, `last_executed_at` timestamps
- Added `generate_webhook_path()` method

### Schemas (`schemas/`)
- **credentials.py**: Removed `user_id` from `CredentialCreate` (extracted from JWT token)
- **workflow.py**: 
  - Made `credential_id` optional
  - Made `data` default to empty dict
  - Added `webhook_path` and timestamps to response
  - Made node validation more flexible

### Routers

#### `routers/webhook.py` - Complete Rewrite
- Added n8n-style webhook handling with unique paths: `/webh/webhook/{webhook_path}`
- Added test mode endpoint: `/webh/webhook/test/{workflow_id}` for frontend testing
- Passes request body, query params, and headers to workflow context
- Returns execution time, status, and detailed results
- Updates `last_executed_at` on successful execution

#### `routers/workflow.py`
- Generates unique `webhook_path` on workflow creation

#### `routers/credential.py`
- Extracts `user_id` from JWT token instead of request body

### Executor (`executor/executor.py`)
- Updated `execute_workflow()` to accept `initial_context` parameter
- Passes webhook data through execution context
- Returns structured result with `executed_nodes` list
- Better error handling per node

---

## Frontend Changes

### New Files

#### State Management
- `src/store/workflowStore.ts` - Zustand store for workflow state
- `src/types/workflow.ts` - TypeScript interfaces for all entities

#### Services
- `src/services/credential.service.ts` - CRUD operations for credentials
- Updated `src/services/workflow.service.ts` - Full CRUD + execute
- Updated `src/services/api-caller.ts` - Axios interceptors for JWT auth

#### Components
- `src/components/workflow/NodeConfigPanel.tsx` - Node configuration panel
- `src/components/workflow/nodes/SlackNode.tsx` - Slack node component
- `src/components/credentials/CredentialForm.tsx` - Credential creation form

### Modified Files

#### Pages
- **WorkflowEditor.tsx** - Complete rewrite with:
  - Workflow title input
  - Save/Execute buttons with loading states
  - Webhook URL copy button
  - Node configuration panel integration
  - Load existing workflow for editing

- **Workflows.tsx** - Enhanced with:
  - Working delete functionality
  - Execution with loading state
  - Modern UI with gradients
  - Webhook badge display
  - Last executed timestamp

- **Credentials.tsx** - Enhanced with:
  - Platform-specific icons
  - Gradient card backgrounds
  - Working delete functionality

- **Index.tsx** - New landing page with:
  - Gradient hero section
  - Animated background effects
  - Feature grid
  - CTA buttons

- **Auth.tsx** - Enhanced with:
  - Glassmorphism card
  - Animated background
  - Loading states

#### Components
- **WorkflowCanvas.tsx** - Zustand integration, MiniMap, enhanced styling
- **AppSidebar.tsx** - User info section, logout button, improved styling
- **All Node Components** - Selection state, configuration preview, gradient icons

---

## API Endpoints Reference

### Authentication
- `POST /auth/signup` - Create new user
- `POST /auth/signin` - Login, returns JWT token

### Workflows
- `GET /workf/workflow` - List user's workflows
- `POST /workf/workflow` - Create workflow (generates webhook_path)
- `GET /workf/workflow/{id}` - Get single workflow
- `PUT /workf/workflow/{id}` - Update workflow
- `DELETE /workf/workflow/{id}` - Delete workflow

### Credentials
- `GET /credential/credential` - List user's credentials
- `POST /credential/credential` - Create credential
- `DELETE /credential/credential/{id}` - Delete credential

### Webhooks
- `GET/POST /webh/webhook/{webhook_path}` - Execute workflow by webhook path
- `GET/POST /webh/webhook/handler/{id}` - Execute workflow by ID (legacy)
- `POST /webh/webhook/test/{id}` - Test mode execution

---

## State Management

Using **Zustand** for workflow editor state:

```typescript
// Key state
currentWorkflow, workflowTitle, nodes, edges, selectedNodeId

// Key actions  
loadWorkflow, saveWorkflow, createWorkflow, executeWorkflow
addNode, updateNodeData, selectNode
```

---

## Running the Application

```bash
# Terminal 1: Backend
cd backend
uv run uvicorn main:app --reload --port 8001

# Terminal 2: Frontend
cd frontend
npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:8001
API Docs: http://localhost:8001/docs
