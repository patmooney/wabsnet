export interface IFileContent {
    [key: string]: {
        list: string[];
        content: {
            [key: string]: {
                mimeType: string;
                fileName: string;
                content: string;
            }
        }
    }
};
