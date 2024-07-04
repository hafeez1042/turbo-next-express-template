import swaggerSpec from "./swaggerSpec";

const fs = require('fs');

fs.writeFileSync('./swagger.json', JSON.stringify(retainRequiredPropertiesInPaths(swaggerSpec), null, 2));
interface JsonObject {
  [key: string]: any;
}

function retainRequiredPropertiesInPaths(schema: JsonObject): JsonObject {
  const result: JsonObject = {};

  for (const [key, value] of Object.entries(schema)) {
    if (key === "paths") {
      result[key] = {};
      for (const [pathKey, pathValue] of Object.entries(value)) {
        result[key][pathKey] = {};
        for (const [methodKey, methodValue] of Object.entries(pathValue as JsonObject)) {
          // Retain only essential properties for AWS API Gateway
          result[key][pathKey][methodKey] = {
            responses: methodValue["responses"],
            requestParameters: methodValue["requestParameters"],
            requestModels: methodValue["requestModels"]
          };
          // Add other properties as necessary
        }
      }
    } else if (typeof value === "object" && value !== null) {
      result[key] = retainRequiredPropertiesInPaths(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}
