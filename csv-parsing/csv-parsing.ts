import fetch from 'node-fetch';
import { parseISO, getYear, getISOWeek, format, getDay } from 'date-fns';
import { createObjectCsvWriter } from 'csv-writer';

// 깃허브 릴리즈 데이터 DTO
interface GitHubRelease {
  id: number; // 릴리즈 고유 id
  name: string; // 릴리즈 타이틀 
  tag_name: string; // 릴리즈 태그명 (버전)
  body: string, // 릴리즈 디스크립션
  published_at: string; // 공개 시각
  created_at: string; // 생성 시각
  [key: string]: any;
}

// csv 내 데이터 타입
interface ReleaseStats {
  releaseInfo: string[],
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
    const weekday = format(dateObj, 'EEEE');
    const title = release.name || release.tag_name;
    const description = ((release.body || '').split(/[\r\n]+/) as string[])
      .map((line: string) => line.trim())
      .filter((line: string) =>
        line &&
        line !== '### Patch Changes' &&
        line !== '• ### Patch Changes' &&
        line !== '🔧 Patch Changes'
      )
      .map((line: string) => `${line}`)
      .join('\n');
    const createdAt = format(parseISO(release.created_at), 'yyyy-MM-dd HH:mm');
    const key = `$${date}`;

    const fullText = [
    '───────────────',
    `📦 ${title}`,
    `🗓 ${createdAt}`,
    '',
    description ? `🔧 Patch Changes\n${description}` : '🔧 Patch Changes\n• (No description)',
  ].join('\n');

    if (statsMap.has(key)) {
      const stat = statsMap.get(key)!;
      stat.count += 1;
      stat.releaseInfo.push(fullText); 
    } else {
      statsMap.set(key, {
        releaseInfo: [fullText],
        date: date,
        weekday: weekday,
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
      { id: 'releaseInfo', title: 'Releases' }
    ],
  });

  const records = stats.map(stat => ({
    ...stat,
    releaseInfo: stat.releaseInfo.join('\n'),
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