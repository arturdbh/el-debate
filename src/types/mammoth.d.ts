declare module 'mammoth' {
  export interface MammothResult {
    value: string;
    messages: Array<{ type: string; message: string }>;
  }

  export interface ExtractRawTextOptions {
    arrayBuffer?: ArrayBuffer;
    buffer?: Buffer;
    path?: string;
  }

  export interface ConvertToHtmlOptions {
    arrayBuffer?: ArrayBuffer;
    buffer?: Buffer;
    path?: string;
    convertImage?: any;
  }

  export function extractRawText(options: ExtractRawTextOptions): Promise<MammothResult>;
  export function convertToHtml(input: ConvertToHtmlOptions, options?: any): Promise<MammothResult>;
  export const images: {
    inline: (fn: (element: any) => Promise<{ src: string }>) => any;
  };
}
