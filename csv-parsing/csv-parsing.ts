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

// csv 내 데이터 타입
interface ReleaseStats {
  titles: string[],
  date: string;
  weekday: string;
  count: number;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
    const dateObj = parseISO(release.published_at);
    if (isWeekend(dateObj)) return ; // 주말 제외
    const date = format(dateObj, 'yyyy-MM-dd');
    const weekday = format(dateObj, 'EEEE'); // 요일 (ex: Monday)
    const title = release.name || release.tag_name;
    const key = `$${date}`;

    if (statsMap.has(key)) {
      const stat = statsMap.get(key)!;
      stat.count += 1;

      if (Array.isArray(stat.titles)) {
        stat.titles.push(title);
      } else {
        stat.titles = [title];
      }
    } else {
      statsMap.set(key, {
        titles: [title],
        date,
        weekday,
        count: 1,
      });
    }
  });

  return Array.from(statsMap.values());
}

// CSV 파일 생성 함수
async function saveStatsToCSV(stats: ReleaseStats[], filename: string) {
  const csvWriter = createObjectCsvWriter({
    path: filename,
    header: [
      { id: 'date', title: 'Date' },
      { id: 'weekday', title: 'Weekday'},
      { id: 'count', title: 'Release Count' },
      { id: 'titles', title: 'Release Titles' },
    ],
  });

  const records = stats.map(stat => ({
    ...stat,
    titles: stat.titles.join('\n'),
  }));

  await csvWriter.writeRecords(records);
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