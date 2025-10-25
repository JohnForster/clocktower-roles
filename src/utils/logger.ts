const FIREBASE_URL = "https://logusage-dvbaqkhwga-uc.a.run.app";

interface LogSessionParams {
  script: string;
  includeTravellers: boolean;
  characterCount: number;
}

export const logSession = async ({
  script,
  includeTravellers,
  characterCount,
}: LogSessionParams) => {
  // Only log usage in production environment
  if (import.meta.env.DEV) {
    return;
  }

  fetch(FIREBASE_URL, {
    method: "POST",
    body: JSON.stringify({
      app: "roles-revision",
      sessionType: "flashcard-quiz",
      script,
      includeTravellers,
      characterCount,
    }),
    headers: {
      "x-password": "dungeon-mister",
      "Content-Type": "application/json",
    },
  }).catch(console.error);
};
