export function getRoleFromToken(token: string | undefined): string | null {
    if (!token) return null;
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        const payload = JSON.parse(
            Buffer.from(parts[1], "base64url").toString("utf-8")
        );

        return payload.role || null;
    } catch {
        return null;
    }
}