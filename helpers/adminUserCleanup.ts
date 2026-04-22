import type { UsersClient } from '../httpclients/usersClient';

const ACCEPTED_DELETE_STATUSES = new Set([204, 404]);

export class AdminUserCleanup {
  private readonly usernames = new Set<string>();

  constructor(
    private readonly usersClient: UsersClient,
    private readonly adminToken: string
  ) {}

  trackUsername(username: string): void {
    this.usernames.add(username);
  }

  async cleanup(): Promise<void> {
    const failures: string[] = [];

    for (const username of this.usernames) {
      const deleteResponse = await this.usersClient.deleteUser(username, this.adminToken);

      if (!ACCEPTED_DELETE_STATUSES.has(deleteResponse.status())) {
        failures.push(`DELETE user ${username} returned ${deleteResponse.status()}`);
      }
    }

    if (failures.length > 0) {
      throw new Error(`Admin user cleanup failed:\n${failures.join('\n')}`);
    }
  }
}
