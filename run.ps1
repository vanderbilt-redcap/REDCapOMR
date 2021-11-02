$ErrorActionPreference = "Stop"

$pwd=(get-location)

$build_args=@(
    'compose',
    'build',
    '--build-arg', 'UID=1000',
    '--build-arg', 'GID=1000',
    'redcap-omr'
)

& docker @build_args

$run_args=@(
    'compose',
    'run',
    '-v', """${pwd}:/var/www/html/redcap-omr""",
    '-p', '8080:80',
    'redcap-omr'
)

& docker @run_args