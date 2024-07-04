const swag = require("./swagger.json");
function transformPaths(swaggerDoc) {
  const transformedPaths = { ...swaggerDoc };

  for (const path in swaggerDoc.paths) {
    const methods = swaggerDoc.paths[path];

    const transformedMethods = {};

    for (const method in methods) {
      transformedMethods[method] = methods[method];
      if (method === "options") continue;

      const originalIntegration =
        methods[method]["x-amazon-apigateway-integration"];

      if (!originalIntegration) continue;

      if (originalIntegration.uri.endsWith("/{id}")) {
        originalIntegration.requestParameters["integration.request.path.id"] =
          "method.request.path.id";

        if (
          !methods[method].parameters.some(
            (item) => item.name === "id" && item.in === "path"
          )
        ) {
          methods[method].parameters.push({
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          });
        }
      }

      console.log({ method, path });
      originalIntegration.httpMethod = method.toUpperCase()

      originalIntegration.responses.default.responseParameters = {
        "method.response.header.Access-Control-Allow-Origin": "'*'",
      };
      if (method === "get") {
        if (originalIntegration.requestParameters) {
          originalIntegration.requestParameters[
            "integration.request.querystring.query"
          ] = "method.request.querystring.query";
        } else {
          originalIntegration.requestParameters = {
            "integration.request.querystring.query":
              "method.request.querystring.query",
          };
        }
      }

      transformedMethods[method] = {
        ...transformedMethods[method],
        security: methods[method].security,
        "x-amazon-apigateway-integration": originalIntegration,
        responses: {
          400: {
            description: "400 response",
            content: {},
          },
          200: {
            description: "200 response",
            headers: {
              "Access-Control-Allow-Origin": {
                schema: {
                  type: "string",
                },
              },
            },
            content: {},
          },
        },
      };
    }

    transformedPaths.paths[path] = transformedMethods;
  }

  return transformedPaths;
}

const fs = require("fs");

fs.writeFileSync(
  "./swagger1.json",
  JSON.stringify(transformPaths(swag), null, 2)
);
