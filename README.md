# Github Release Dashboard
이 대쉬보드는 아래 두 깃허브 레포지토리 릴리즈 데이터를 기반으로 일자별, 요일별에 따른 릴리즈 배포수 및 릴리즈 데이터 현황을 시각화합니다. 

[daangn/seed-design](https://github.com/daangn/seed-design/releases) 

[daangn/stackflow](https://github.com/daangn/stackflow) 

## Features

- 📅 **날짜별 릴리즈 수**: 날짜를 기준으로 릴리즈 빈도를 시각화
- 📆 **요일별 릴리즈 수**: 어떤 요일에 릴리즈가 집중되는지 파악

## 기술 스택

## 향후 계획
- 검색 및 필터 기능
- 릴리즈 데이터에 포함된 prefix에 따른 기능 분류 및 시각화

Raw 데이터는 `/csv-parsing/release-json-data.json` 형식으로, 다음 필드를 포함합니다:

```json
{
    "id": 101,
    "name": "v1.0.0 - Initial Release",
    "tag_name": "v1.0.0",
    "body": "첫 번째 공식 릴리즈입니다.\n- 주요 기능 구현 완료\n- 초기 버그 수정",
    "published_at": "2025-05-15T10:00:00Z",
    "created_at": "2025-05-10T08:30:00Z",
    "author": "alice"
}
```