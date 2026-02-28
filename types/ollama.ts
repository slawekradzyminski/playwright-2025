export interface StreamedRequestDto {
  model: string;
  prompt: string;
  options?: Record<string, unknown>;
  think?: boolean;
}

export interface ToolCallFunctionDto {
  name: string;
  arguments?: Record<string, unknown>;
}

export interface ToolCallDto {
  id?: string;
  function: ToolCallFunctionDto;
}

export interface ChatMessageDto {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content?: string;
  thinking?: string;
  tool_calls?: ToolCallDto[];
  tool_name?: string;
}

export interface OllamaToolSchemaPropertyDto {
  type?: string;
  description?: string;
  enum?: string[];
}

export interface OllamaToolParametersRequirementDto {
  required: string[];
}

export interface OllamaToolParametersDto {
  type: string;
  properties: Record<string, OllamaToolSchemaPropertyDto>;
  required?: string[];
  oneOf?: OllamaToolParametersRequirementDto[];
}

export interface OllamaToolFunctionDto {
  name: string;
  description?: string;
  parameters: OllamaToolParametersDto;
}

export interface OllamaToolDefinitionDto {
  type: 'function';
  function: OllamaToolFunctionDto;
}

export interface ChatRequestDto {
  model: string;
  messages: ChatMessageDto[];
  options?: Record<string, unknown>;
  tools?: OllamaToolDefinitionDto[];
  think?: boolean;
}

export interface GenerateResponseDto {
  model?: string;
  response?: string;
  thinking?: string;
  done?: boolean;
  context?: number[] | null;
  created_at?: string;
  total_duration?: number | null;
}

export interface ChatResponseDto {
  model?: string;
  message?: ChatMessageDto;
  done?: boolean;
  created_at?: string;
}
