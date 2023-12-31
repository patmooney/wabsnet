import { app as help } from "./help";
import { app as apps } from "./apps";
import { app as news } from "./news";
import { app as chat } from "./chat";
import { app as netstat } from "./netstat";
import { app as file } from "./file";

export default {
    [help.name]: help,
    [apps.name]: apps,
    [news.name]: news,
    [chat.name]: chat,
    [netstat.name]: netstat,
    [file.name]: file
};
