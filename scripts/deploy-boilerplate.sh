#!/bin/bash

# Any command that using GH_OAUTH_TOKEN must pipe the output to /dev/null to not expose your oauth token
if [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ] && [[ ${TRAVIS_JOB_NUMBER} == *".2" ]]
then
  node scripts/buildBoilerplate.js --no-insight
  git clone https://${GH_OAUTH_TOKEN}@github.com/${GH_OWNER}/${GH_PROJECT_NAME} site > /dev/null 2>&1
  cd site
  git rm -r .
  cp -R ../test/tmp/work/dist/* .
  cp ../test/tmp/work/dist/.* .
  git add -f .
  git config user.email "bot@zckrs.com"
  git config user.name "zckrsBot"
  git commit -m "Deployed with Travis Job ${TRAVIS_JOB_NUMBER}"
  git push https://${GH_OAUTH_TOKEN}@github.com/${GH_OWNER}/${GH_PROJECT_NAME} HEAD:gh-pages > /dev/null 2>&1
else
  echo "You are not in master branch!"
fi
