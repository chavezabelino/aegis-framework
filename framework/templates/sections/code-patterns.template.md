<!--
@aegisFrameworkVersion: 2.5.0
@intent: Code patterns and integration examples template section
@context: Operational code patterns for agent guidance
-->

## 🧪 Code Patterns & Integration Examples

### Edge Function Call Pattern

```
import {invokeEdgeFunctionSimple} from "@/lib/edge-function-client"
import {PreviewTeamsResponseSchema} from "@/schemas/API/team-preview"

const result = await invokeEdgeFunctionSimple("preview-teams", {input: teamData}, PreviewTeamsResponseSchema)
```

### Schema Validation & Transforms

```
// Schema Naming Convention:
// *RowSchema → DB layer (snake_case)
// *ModelSchema → App layer (camelCase)

import {unwrapAndValidate} from "@/lib/API-response"

const validated = unwrapAndValidate(response, TeamModelSchema)
```

### Environment Config Validation

```
import {z} from "zod"

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  NODE_ENV: z.enum(["development", "production", "staging"]).default("development")
})

// Validate at startup
const env = envSchema.parse(process.env)
```

### Supabase CORS Handler (Mandatory)

```
import {handleCorsPrelight} from "../_shared/lib/corsHeaders.ts"
import {createSuccessResponse, createErrorResponse} from "../_shared/lib/responseHelpers.ts"

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return handleCorsPrelight()

  try {
    const result = await processRequest(req)
    return createSuccessResponse(result, correlationId)
  } catch (error) {
    return createErrorResponse(error, correlationId)
  }
}
```
