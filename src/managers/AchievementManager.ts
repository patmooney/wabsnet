
export enum AchievementsType {
    firstConnection
};

export class AchievementManager {
    private achievementMap: Map<AchievementsType, Date>;

    constructor () {
        this.achievementMap = new Map<AchievementsType, Date>;
    }

    hasAchievement(achievement: AchievementsType) {
        return this.achievementMap.has(achievement);
    }

    addAchievement(achievement: AchievementsType, date = new Date()) {
        if (this.hasAchievement(achievement)) {
            return false;
        }
        this.achievementMap.set(achievement, date);
        return true;
    }
}
