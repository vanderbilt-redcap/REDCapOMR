docker compose build --build-arg UID=1000 --build-arg GID=1000 redcap-omr || goto :end
docker compose run -v "%cd%:/var/www/html/redcap-omr" -p 8080:80 redcap-omr || goto :end

:end
pause
exit
