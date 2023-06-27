#!/usr/bin/env bash

# if jinja2 is not installed, echo a message and exit
if ! command -v jinja2 &> /dev/null
then
    printf '%s\n' "jinja2 could not be found"
    printf '%s\n' "Please install jinja2"
    printf '%s\n' "Hint: 'pip install jinja2'"
    exit
fi

output_file="templatized-test-that-dont-work-yet.ts"
jinja2 jinja/template.j2 jinja/vars.yml > "$output_file"
printf "%s\n" "Tests have been generated in ./""$output_file"""
