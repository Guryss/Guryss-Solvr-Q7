import fetch from 'node-fetch';
import { parseISO, getYear, getISOWeek, format, getDay } from 'date-fns';
import { createObjectCsvWriter } from 'csv-writer';

// 깃허브 릴리즈 데이터 DTO
interface GitHubRelease {
  id: number;
  name: string;
  tag_name: string;
  published_at: string;
  draft: boolean;
  prerelease: boolean;
  [key: string]: any;
}

interface ReleaseStats {
  year: number;
  week: number;
  date: string;
  count: number;
}

// 레포지토리 데이터 비동기 fetch 함수
async function fetchReleases(owner: string, repo: string): Promise<GitHubRelease[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch releases for ${owner}/${repo}`);
  }
  const data = await response.json();
  return data as GitHubRelease[];
}

// 주말인지 확인하는 함수
function isWeekend(date: Date): boolean {
    const day = getDay(date);
    return day === 0 || day === 6;
}

function generateStats(releases: any[]): ReleaseStats[] {
  const statsMap = new Map<string, ReleaseStats>();

  releases.forEach(release => {
    const date = parseISO(release.published_at);
    if (isWeekend(date)) return ; // 주말 제외

    const year = getYear(date);
    const week = getISOWeek(date);
    const day = format(date, 'yyyy-MM-dd');
    const key = `${year}-W${week}-${day}`;

    if (statsMap.has(key)) {
      statsMap.get(key)!.count += 1;
    } else {
      statsMap.set(key, { year, week, date: day, count: 1 });
    }
  });

  return Array.from(statsMap.values());
}

// CSV 파일 생성 함수
async function saveStatsToCSV(stats: ReleaseStats[], filename: string) {
  const csvWriter = createObjectCsvWriter({
    path: filename,
    header: [
      { id: 'year', title: 'Year' },
      { id: 'week', title: 'Week' },
      { id: 'date', title: 'Date' },
      { id: 'count', title: 'Release Count' },
    ],
  });

  await csvWriter.writeRecords(stats);
}

async function main() {
    // 레포지토리 정의
    const repos = [
        { owner: 'daangn', repo: 'stackflow' },
        { owner: 'daangn', repo: 'seed-design' },
    ];

    for (const { owner, repo } of repos) {
    try {
        const releases = await fetchReleases(owner, repo);
        const stats = generateStats(releases);
        const filename = `${repo}_release_stats.csv`;
        await saveStatsToCSV(stats, filename);
        console.log(`Saved stats for ${owner}/${repo} to ${filename}`);
    } catch (error) {
        console.error(`Error processing ${owner}/${repo}:`, error);
    }
  }
}

main();