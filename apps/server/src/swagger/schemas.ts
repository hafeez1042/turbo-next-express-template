import swaggerJSDoc from "swagger-jsdoc";


export const schemas: swaggerJSDoc.Schema = {
  BaseModelAttributes: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Unique identifier for the object",
      },
      created_at: {
        type: "string",
        format: "date-time",
        description: "The date and time when the object was created",
      },
      updated_at: {
        type: "string",
        format: "date-time",
        description: "The date and time when the object was last updated",
      },
      created_by: {
        type: "string",
        description: "Identifier of the user who created the object",
      },
      updated_by: {
        type: "string",
        description: "Identifier of the user who last updated the object",
      },
    },
    description: "Base model attributes common across different entities",
  },
  D: {
    type: "object",
  },
  APIV1Response: {
    properties: {
      data: {
        $ref: "#/components/schemas/D",
      },
      errors: {
        items: {
          type: "string",
        },
        type: "array",
      },
      message: {
        type: "string",
      },
      success: {
        type: "boolean",
      },
      validationErrors: {
        additionalProperties: {
          items: {
            type: "string",
          },
          type: "array",
        },
        type: "object",
      },
      version: {
        const: "v1",
        type: "string",
      },
    },
    type: "object",
  },

  QueryStringParams: {
    type: "object",
    properties: {
      q: {
        type: "string",
        description: "Optional. A query string for search operations.",
      },
      filter: {
        $ref: "#/components/schemas/FieldFilter",
      },
      orderBy: {
        type: "string",
        description: "Optional. The field name to sort the results by.",
      },
      order: {
        type: "string",
        enum: ["asc", "dsc"],
        description:
          "Optional. The order of sorting: 'asc' for ascending, 'dsc' for descending.",
      },
      limit: {
        type: "integer",
        description:
          "Optional. The maximum number of items to return. Used for pagination or limiting result size.",
      },
      skip: {
        type: "integer",
        description:
          "Optional. The number of items to skip. Used for offset-based pagination.",
      },
      cursor: {
        type: "string",
        description:
          "Optional. A cursor for cursor-based pagination. Typically, this is the identifier of the last item in the previous set of results.",
      },
    },
  },
  FieldFilter: {
    type: "object",
    additionalProperties: {
      type: "object",
      properties: {
        startsWith: {
          type: "string",
        },
        contains: {
          type: "string",
        },
        endsWith: {
          type: "string",
        },
        eq: {
          oneOf: [
            { type: "string" },
            { type: "number" },
            { type: "boolean" },
            { type: "null" },
          ],
        },
        neq: {
          oneOf: [
            { type: "string" },
            { type: "number" },
            { type: "boolean" },
            { type: "null" },
          ],
        },
        lt: {
          type: "number",
        },
        lte: {
          type: "number",
        },
        gt: {
          type: "number",
        },
        gte: {
          type: "number",
        },
        in: {
          type: "array",
          items: {
            oneOf: [
              { type: "string" },
              { type: "number" },
              { type: "boolean" },
              { type: "null" },
            ],
          },
        },
        nin: {
          type: "array",
          items: {
            oneOf: [
              { type: "string" },
              { type: "number" },
              { type: "boolean" },
              { type: "null" },
            ],
          },
        },
      },
    },
  },

};
