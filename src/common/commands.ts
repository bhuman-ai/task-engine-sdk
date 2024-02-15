export type RemoteCommand = {
  name: string;
  description: string;
  args: string[];
};

export type APICommand = RemoteCommand & {
  method: string;
  urlTemplate: string;
  bodyTemplate?: string;
  headersTemplate?: string;
};
