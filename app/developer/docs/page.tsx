"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Menu, X, BookOpen, ChevronRight } from "lucide-react";

// Dynamically import syntax highlighter to avoid SSR issues
const SyntaxHighlighter = dynamic(
  () =>
    import("react-syntax-highlighter").then((mod) => {
      const { Prism } = mod;
      return Prism;
    }),
  { ssr: false }
);

const markdownContent = `# Plugin Development Guide

This guide explains how to create backend plugins in the \`src/plugins/\` folder. Each plugin is a self-contained module with its own models, controllers, and routes.

## Table of Contents

1. [Step 1: Generate Plugin ID](#step-1-generate-plugin-id)

2. [Step 2: Create Plugin Folder Structure](#step-2-create-plugin-folder-structure)

3. [Step 3: Create Plugin Registration File](#step-3-create-plugin-registration-file)

4. [Step 4: Define Models](#step-4-define-models)

5. [Step 5: Create Controllers](#step-5-create-controllers)

6. [Step 6: Create Routes](#step-6-create-routes)

7. [Understanding Request Context](#understanding-request-context)

8. [Example: Complete Plugin Implementation](#example-complete-plugin-implementation)

9. [Best Practices](#best-practices)

---

## Step 1: Generate Plugin ID

Before creating your plugin, you need to generate a unique plugin ID.

### How to Generate

Visit **\`dev.relmes.in/generatePluginId\`** in your browser. You will receive a unique plugin ID in the format:

\`\`\`
plg_3e2ecde485bc
\`\`\`

**Important:** Save this plugin ID - you'll use it throughout your plugin implementation as your folder name and in your code.

---

## Step 2: Create Plugin Folder Structure

Create a folder in \`src/plugins/\` with your plugin ID as the folder name:

\`\`\`
src/plugins/
  └── plg_3e2ecde485bc/          # Your plugin ID
      ├── register.ts             # Required: Plugin registration
      ├── models/                 # Optional: Mongoose schemas
      │   └── drive.ts
      ├── controllers/            # Optional: Route handlers
      │   └── drive.ts
      └── routes/                 # Optional: Route definitions
          └── route.ts
\`\`\`

**Required Files:**
- \`register.ts\` - Must exist for the plugin to be discovered

**Optional Folders:**
- \`models/\` - Mongoose schemas for your plugin
- \`controllers/\` - Business logic and route handlers
- \`routes/\` - Express route definitions

**Important:** All plugin files should use the \`.ts\` extension (TypeScript). The system prioritizes TypeScript files (\`.ts\`) over JavaScript files (\`.js\`).

---

## Step 3: Create Plugin Registration File

Create \`register.ts\` in your plugin folder. This file is responsible for registering your plugin's Mongoose models in tenant databases.

### File: \`src/plugins/{pluginId}/register.ts\`

\`\`\`typescript
import { Connection } from "mongoose";

import yourModelSchema from "./models/yourModel";

export default {
  pluginId: "plg_3e2ecde485bc", // Your generated plugin ID

  name: "YourPluginName", // Display name

  version: "1.0.0", // Version number

  /**

   * Register function is called for each tenant database connection

   * @param conn - Mongoose connection to the tenant database

   * @returns boolean indicating success

   */

  register(conn: Connection) {
    // Register your models here

    // Use a unique model name prefixed with your plugin ID to avoid conflicts

    conn.model(
      "plg_3e2ecde485bc_YourModel", // Model name (unique)

      yourModelSchema, // Schema definition

      "plg_3e2ecde485bc_yourmodel" // Collection name (optional, lowercase)
    );

    return true;
  },
};
\`\`\`

### Key Points:

1. **Export Default:** The registration object must be the default export
2. **pluginId:** Must match your folder name exactly
3. **register():** Called automatically when a tenant database connection is established
4. **Model Naming:** Prefix model names with your plugin ID to avoid conflicts
5. **Collection Naming:** Use lowercase, snake_case for collection names

---

## Step 4: Define Models

Create Mongoose schemas for your plugin's data models.

### File: \`src/plugins/{pluginId}/models/yourModel.ts\`

\`\`\`typescript
const { Schema } = require("mongoose");

module.exports = new Schema(
  {
    // Define your schema fields

    name: { type: String, required: true },

    description: String,

    userId: { type: Schema.Types.ObjectId, ref: "User" },

    serverId: { type: Schema.Types.ObjectId, ref: "Server" },

    data: { type: Object },

    // ... other fields
  },
  { timestamps: true } // Adds createdAt and updatedAt
);
\`\`\`

### Alternative TypeScript Style:

\`\`\`typescript
import mongoose from "mongoose";

const yourModelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    description: String,

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
  },
  { timestamps: true }
);

export default yourModelSchema;
\`\`\`

**Note:** Models are registered per-tenant, so each server/realm has its own isolated data.

---

## Step 5: Create Controllers

Controllers contain your business logic and handle HTTP requests.

### File: \`src/plugins/{pluginId}/controllers/yourController.ts\`

\`\`\`typescript
import { Request, Response } from "express";

import plugin from "../register";

export async function yourControllerFunction(req: Request, res: Response) {
  try {
    // 1. Register plugin models (if not already registered)

    plugin.register(req.realmConn!);

    // 2. Get your model from the realm connection

    const YourModel = req.realmConn!.model("plg_3e2ecde485bc_YourModel");

    // 3. Access server context

    const serverId = req.server!._id;

    const server = req.server!;

    // 4. Access request data

    const { userId, someData } = req.body;

    const { paramId } = req.params;

    // 5. Perform your business logic

    const document = await YourModel.create({
      name: someData,

      userId,

      serverId,
    });

    // 6. Return response

    return res.json({ success: true, data: document });
  } catch (err) {
    console.error("Error:", err);

    return res.status(500).json({ error: "Operation failed" });
  }
}
\`\`\`

---

## Step 6: Create Routes

Routes define the HTTP endpoints for your plugin. Routes are automatically discovered and mounted.

### File: \`src/plugins/{pluginId}/routes/route.ts\`

\`\`\`typescript
import express from "express";

import { yourControllerFunction } from "../controllers/yourController";

import multer from "multer";

const upload = multer();

// Export a function that returns a router

export default function createYourRouter() {
  const router = express.Router();

  // Define your routes

  router.get("/list", yourControllerFunction);

  router.post("/create", yourControllerFunction);

  router.put("/update/:id", yourControllerFunction);

  router.delete("/delete/:id", yourControllerFunction);

  // File upload example

  router.post("/upload", upload.single("file"), yourControllerFunction);

  return router;
}
\`\`\`

### Route File Structure:

You can organize routes in nested folders. The folder structure maps directly to URL paths:

\`\`\`
routes/

  ├── route.ts              → /route

  ├── users/

  │   ├── list.ts          → /users/list

  │   └── create.ts        → /users/create

  └── files/

      └── upload.ts        → /files/upload
\`\`\`

**Important:** Each route file must export a function that returns an Express router.

---

## Understanding Request Context

When your plugin routes are called, the request object includes the following properties:

### Available Request Properties:

- \`req.realmConn\` - Mongoose connection to the tenant database

- \`req.server\` - Server document with server information

- \`req.server._id\` - Server ID (ObjectId)

- \`req.server.dbName\` - Tenant database name

- \`req.params.serverId\` - Server ID from URL parameter

### Using the Realm Connection

\`\`\`typescript
// Always register your plugin first

plugin.register(req.realmConn!);

// Then access your models

const YourModel = req.realmConn!.model("plg_3e2ecde485bc_YourModel");

// Perform database operations

const docs = await YourModel.find({ serverId: req.server!._id });
\`\`\`

**Note:** \`req.realmConn\` and \`req.server\` are automatically available in your plugin routes. You don't need to set them up - they're provided by the system.

---

## Example: Complete Plugin Implementation

Here's a complete example based on the existing Drive plugin:

### 1. Folder Structure

\`\`\`
src/plugins/plg_3e2ecde485bc/
  ├── register.ts
  ├── models/
  │   └── drive.ts
  ├── controllers/
  │   └── drive.ts
  └── routes/
      └── route.ts
\`\`\`

### 2. Register File

\`\`\`typescript
// src/plugins/plg_3e2ecde485bc/register.ts
import { Connection } from "mongoose";

import driveSchema from "./models/drive";

export default {
  pluginId: "plg_3e2ecde485bc",

  name: "DriveTS",

  version: "1.0.0",

  register(conn: Connection) {
    conn.model("plg_3e2ecde485bc_Drive", driveSchema, "plg_3e2ecde485bc_drive");

    return true;
  },
};
\`\`\`

### 3. Model File

\`\`\`typescript
// src/plugins/plg_3e2ecde485bc/models/drive.ts
const { Schema } = require("mongoose");

module.exports = new Schema(
  {
    filename: String,
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    serverId: { type: Schema.Types.ObjectId, ref: "Server" },
    size: Number,
    mimetype: String,
    s3Key: String,
  },
  { timestamps: true }
);
\`\`\`

### 4. Controller File

\`\`\`typescript
// src/plugins/plg_3e2ecde485bc/controllers/drive.ts
import { Request, Response } from "express";

import { PutObjectCommand } from "@aws-sdk/client-s3";

import { BUCKET_NAME } from "../../../utils/config";

import { uploads3 } from "../../../utils/s3.config";

import plugin from "../register";

export async function uploadFile(req: Request, res: Response) {
  try {
    if (!req.file) return res.status(400).json({ error: "File not found" });

    // Register plugin models

    plugin.register(req.realmConn!);

    // Get model

    const Drive = req.realmConn!.model("plg_3e2ecde485bc_Drive");

    const userId = req.body.userId;

    const serverId = req.server!._id;

    // Upload to S3

    const s3Key = \`plg_3e2ecde485bc/\${serverId}/\${Date.now()}-\${
      req.file.originalname
    }\`;

    await uploads3(BUCKET_NAME, s3Key, req.file.buffer, req.file.mimetype);

    // Save metadata to database

    const fileDoc = await Drive.create({
      filename: req.file.originalname,

      uploadedBy: userId,

      serverId,

      size: req.file.size,

      mimetype: req.file.mimetype,

      s3Key,
    });

    return res.json({ success: true, file: fileDoc });
  } catch (err) {
    console.error("Upload Error", err);

    return res.status(500).json({ error: "Upload failed" });
  }
}
\`\`\`

### 5. Route File

\`\`\`typescript
// src/plugins/plg_3e2ecde485bc/routes/route.ts
import { uploadFile } from "../controllers/drive";

import express from "express";

import multer from "multer";

const upload = multer();

export default function createDriveRouter() {
  const router = express.Router();

  router.post("/uploadFile", upload.single("file"), uploadFile);

  return router;
}
\`\`\`

### 6. Testing the Plugin

\`\`\`bash
# Upload a file

curl -X POST \\

  http://localhost:5005/servers/690f08fa040faf5be0ce0dc4/plg_3e2ecde485bc/route/uploadFile \\

  -H "Content-Type: multipart/form-data" \\

  -F "file=@/path/to/your/file.pdf" \\

  -F "userId=6897636bd6850b164919e8c1"
\`\`\`

---

## Best Practices

### 1. **Plugin ID Naming**

- Always use the generated plugin ID from \`dev.relmes.in/generatePluginId\`

- Use the same ID for folder name, model names, and collection names

- Never hardcode plugin IDs - use the generated one

### 2. **Model Registration**

- Always call \`plugin.register(req.realmConn!)\` in controllers before using models

- Use unique model names prefixed with your plugin ID

- Use lowercase, snake_case for collection names

### 3. **Error Handling**

- Always wrap controller logic in try-catch blocks

- Return appropriate HTTP status codes

- Log errors for debugging

### 4. **Type Safety**

- Use TypeScript for better type safety

- Use proper types for Mongoose models

- \`req.realmConn\` and \`req.server\` are automatically typed and available

### 5. **Route Organization**

- Group related routes in subfolders

- Use descriptive route file names

- Keep route files focused on routing, not business logic

### 6. **Database Isolation**

- Remember that each server has its own tenant database

- Data is automatically isolated per server/realm

- Use \`serverId\` in queries to ensure data isolation

### 7. **Testing**

- Test with multiple servers to ensure isolation

- Test with different user contexts

- Verify model registration works correctly

### 8. **Documentation**

- Document your plugin's API endpoints

- Include example requests/responses

- Document required environment variables or dependencies

### 9. **File Extensions**

- **Prioritize TypeScript files:** All plugin files should use the \`.ts\` extension (TypeScript)

- The system prioritizes TypeScript files (\`.ts\`) over JavaScript files (\`.js\`)

- Use \`.ts\` for all plugin files including \`register.ts\`, models, controllers, and routes

---

## Troubleshooting

### Plugin Not Loading

- **Check folder name:** Must match plugin ID exactly

- **Check register.ts:** Must exist and export default object

- **Check pluginId:** Must match folder name

- **Check console:** Look for loading errors at startup

### Routes Not Working

- **Check route file:** Must export a function that returns a router

- **Check file structure:** Route files must be in the \`routes/\` folder

### Model Not Found

- **Check registration:** Call \`plugin.register(req.realmConn!)\` first

- **Check model name:** Must match the name used in \`register()\`

- **Check collection name:** Verify it's correct in \`register()\`

---

## Summary

To create a plugin in \`src/plugins/\`:

1. Generate plugin ID by visiting \`dev.relmes.in/generatePluginId\`

2. Create folder \`src/plugins/{pluginId}/\`

3. Create \`register.ts\` with model registration

4. Define models in \`models/\` folder (optional)

5. Create controllers in \`controllers/\` folder (optional)

6. Create routes in \`routes/\` folder (optional)

**Required:** Only \`register.ts\` is required. All other folders are optional based on your plugin's needs.`;

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function DocsPage() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [codeStyle, setCodeStyle] = useState<any>(null);

  // Load syntax highlighter style
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("react-syntax-highlighter/dist/cjs/styles/prism").then((mod) => {
        setCodeStyle(mod.vscDarkPlus);
      });
    }
  }, []);

  // Extract headings from markdown
  useEffect(() => {
    const headingRegex = /^#{1,6}\s+(.+)$/gm;
    const matches = Array.from(markdownContent.matchAll(headingRegex));
    const extractedHeadings: Heading[] = matches
      .map((match) => {
        const fullMatch = match[0];
        const text = match[1];
        const level = fullMatch.match(/^#+/)?.[0].length || 1;
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        return { id, text, level };
      })
      .filter((h) => h.level <= 3); // Only show h1, h2, h3 in TOC

    setHeadings(extractedHeadings);
  }, []);

  // Handle scroll to update active heading
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map((h) => {
        const element = document.getElementById(h.id);
        return {
          id: h.id,
          element,
          top: element?.getBoundingClientRect().top || 0,
        };
      });

      const visibleHeadings = headingElements.filter(
        (h) => h.top >= 0 && h.top < 200
      );

      if (visibleHeadings.length > 0) {
        setActiveHeading(visibleHeadings[0].id);
      } else {
        // Find the last heading that's above the viewport
        const aboveViewport = headingElements
          .filter((h) => h.top < 0)
          .sort((a, b) => b.top - a.top);
        if (aboveViewport.length > 0) {
          setActiveHeading(aboveViewport[0].id);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveHeading(id);
    }
  };

  const tocItems = headings.filter((h) => h.level <= 2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-900">
            Plugin Development Guide
          </h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5 text-gray-600" />
          ) : (
            <Menu className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:sticky top-0 left-0 h-screen lg:h-auto z-30 w-80 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out overflow-y-auto`}
        >
          <div className="p-6 lg:pt-8">
            <div className="hidden lg:flex items-center gap-2 mb-6">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Documentation</h2>
            </div>
            <nav className="space-y-1">
              {tocItems.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => {
                    scrollToHeading(heading.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    activeHeading === heading.id
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } ${
                    heading.level === 1
                      ? "text-base font-semibold"
                      : heading.level === 2
                      ? "text-sm pl-6"
                      : "text-xs pl-9"
                  }`}
                >
                  {heading.level === 2 && (
                    <ChevronRight className="h-3 w-3 shrink-0" />
                  )}
                  <span className="truncate">{heading.text}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto px-4 py-8 lg:px-8 lg:py-12">
          <article className="prose prose-lg prose-slate max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1
                    id={props.children
                      ?.toString()
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "")}
                    className="text-4xl font-bold text-gray-900 mt-12 mb-6 pb-3 border-b border-gray-200 scroll-mt-20"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    id={props.children
                      ?.toString()
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "")}
                    className="text-3xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-20"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    id={props.children
                      ?.toString()
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "")}
                    className="text-2xl font-semibold text-gray-800 mt-8 mb-3 scroll-mt-20"
                    {...props}
                  />
                ),
                h4: ({ node, ...props }) => (
                  <h4
                    className="text-xl font-semibold text-gray-800 mt-6 mb-2"
                    {...props}
                  />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-gray-700 leading-7 mb-4" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul
                    className="list-disc list-inside space-y-2 mb-4 text-gray-700"
                    {...props}
                  />
                ),
                ol: ({ node, ...props }) => (
                  <ol
                    className="list-decimal list-inside space-y-2 mb-4 text-gray-700"
                    {...props}
                  />
                ),
                li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                code: ({
                  node,
                  inline,
                  className,
                  children,
                  ...props
                }: any) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const language = match ? match[1] : "";
                  const codeString = String(children).replace(/\n$/, "");

                  return !inline && match ? (
                    <div className="my-6 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-400 uppercase">
                          {language}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(codeString);
                          }}
                          className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                      {SyntaxHighlighter && codeStyle ? (
                        <SyntaxHighlighter
                          language={language}
                          PreTag="div"
                          className="!m-0 !rounded-none"
                          style={codeStyle}
                          customStyle={{
                            margin: 0,
                            padding: "1rem",
                            fontSize: "0.875rem",
                            lineHeight: "1.5",
                          }}
                          {...props}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      ) : (
                        <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                          <code>{codeString}</code>
                        </pre>
                      )}
                    </div>
                  ) : (
                    <code
                      className="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-sm font-mono border border-gray-200"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4 bg-blue-50 py-2 rounded-r"
                    {...props}
                  />
                ),
                hr: ({ node, ...props }) => (
                  <hr className="my-8 border-gray-300" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold text-gray-900" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-blue-600 hover:text-blue-700 underline font-medium"
                    {...props}
                  />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-6">
                    <table
                      className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg"
                      {...props}
                    />
                  </div>
                ),
                thead: ({ node, ...props }) => (
                  <thead className="bg-gray-50" {...props} />
                ),
                th: ({ node, ...props }) => (
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <td
                    className="px-4 py-3 text-sm text-gray-700 border-t border-gray-200"
                    {...props}
                  />
                ),
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </article>
        </main>
      </div>
    </div>
  );
}
