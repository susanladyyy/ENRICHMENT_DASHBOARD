// pages/api/time.ts

export default async function handler(req: any, res: any) {
    res.status(200).json({ time: new Date().toJSON() });
}
