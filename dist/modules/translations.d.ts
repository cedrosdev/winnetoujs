interface UpdateTranslationsArgs {
    stringsClass: Record<string, string>;
    translationsPublicPath: string;
}
export declare const updateTranslations: (args: UpdateTranslationsArgs) => Promise<boolean>;
export declare const changeLang: (lang: string, reload?: boolean) => void;
export {};
//# sourceMappingURL=translations.d.ts.map