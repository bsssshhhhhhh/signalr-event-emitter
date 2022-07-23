VERSION=v$(cat package.json | grep version | perl -p -e 's/\s*\"version\": \"(.*?)\",/\1/')
git clean -dfx

git commit --allow-empty -m $VERSION
git tag -a $VERSION -m $VERSION
