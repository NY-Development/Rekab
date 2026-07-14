export function levelBadgeClass(level: string): string {
  switch (level) {
    case 'Beginner':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300';
    case 'Advanced':
      return 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300';
    default:
      return 'bg-muted text-muted-foreground border border-border';
  }
}

export function categoryIcon(category: string): string {
  switch (category) {
    case 'Frontend':
      return 'html';
    case 'Backend':
      return 'javascript';
    case 'DevOps':
      return 'deployed_code';
    case 'Cybersecurity':
      return 'security';
    case 'Networking':
      return 'lan';
    case 'Mobile':
      return 'smartphone';
    default:
      return 'terminal';
  }
}

export function skillIcon(skill: string): string {
  const s = skill.toLowerCase();
  if (s.includes('html') || s.includes('css')) return 'html';
  if (s.includes('javascript') || s.includes('typescript')) return 'javascript';
  if (s.includes('react native') || s.includes('expo') || s.includes('native')) return 'smartphone';
  if (s.includes('react') || s.includes('hook') || s.includes('component')) return 'deployed_code';
  if (s.includes('node') || s.includes('express') || s.includes('nest')) return 'dns';
  if (s.includes('mongo') || s.includes('database') || s.includes('sql')) return 'database';
  if (s.includes('rest') || s.includes('api')) return 'api';
  if (s.includes('auth')) return 'lock';
  if (s.includes('security') || s.includes('owasp')) return 'security';
  if (s.includes('network') || s.includes('tcp') || s.includes('dns') || s.includes('http') || s.includes('osi') || s.includes('lan')) return 'lan';
  if (s.includes('test')) return 'science';
  if (s.includes('guard') || s.includes('interceptor') || s.includes('architecture') || s.includes('module')) return 'account_tree';
  if (s.includes('state') || s.includes('routing')) return 'route';
  return 'check_circle';
}
