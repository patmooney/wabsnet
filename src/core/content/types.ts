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

export interface IContact {
    username: string;
    realName: string;
    remoteIp: string;
}

export interface IChatThread {
    text: string;
    meta: {
        isUser: boolean;
    }
}
