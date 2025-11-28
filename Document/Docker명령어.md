# 컨테이너 중지 + 볼륨 삭제
    docker-compose down -v

# 다시 시작 (init.sql 실행됨)
    docker-compose up -d

# 재빌드
    docker-compose up -d --build

docker-compose.yml 파일이 있는 경로에서 실행해야함.