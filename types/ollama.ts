export interface OllamaToolSchemaPropertyDto {
  type?: string;
  description?: string;
  enum?: string[] | null;
}

export interface OllamaToolParametersRequirementDto {
  required: string[];
}

export interface OllamaToolParametersDto {
  type: string;
  properties: Record<string, OllamaToolSchemaPropertyDto>;
  required?: string[] | null;
  oneOf?: OllamaToolParametersRequirementDto[] | null;
}

export interface OllamaToolFunctionDto {
  name: string;
  description?: string;
  parameters: OllamaToolParametersDto;
}

export interface OllamaToolDefinitionDto {
  type: string;
  function: OllamaToolFunctionDto;
}
