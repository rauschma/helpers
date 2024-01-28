declare module 'quibble' {
  export function esm(modulePath: string, namedExportStubs?: Record<string, any>, defaultExportStub?: any): void;
}
