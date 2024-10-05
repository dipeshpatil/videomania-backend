# **REST APIs for Video Files**

### Requirements

1. All API calls must be authenticated (assume static API tokens)
2. Allow users to upload videos with configurable limits of size and duration
   - maximum size: e.g. `5 mb`, `25 mb`
   - minimum and maximum duration: e.g. `25 secs`, `5 secs`
3. Allow trimming a video
   - for a given video clip (previously uploaded) shorten it from start or end
4. Allow merging video clips
   - for a given list of video clips (previously uploaded) stitch them into a single video file
5. Allow link sharing with time based expiry (assume the expiry time)
6. Write unit and e2e tests.
7. Use SQLite as the database (commit it to the repo)
8. API Docs as `Swagger Endpoint` or `Postman Collection json`

### Expectations

- API Design Best Practices
- Documentation of any assumptions or choices made and why in `README.md`
- Links as citation to any article / code referred to or used
- Appropriate exception handling and error messages
- Code Quality - remove any unnecessary code, avoid large functions
- Good commit history - we won’t accept a repo with a single giant commit 🙅‍♀️

### Submission

1. Create a public github repo for submission
2. Ensure
   - [ ] `README.md` in the repository, with:
     - [ ] commands to set up the repo (language version, dependencies etc.)
     - [ ] commands to run the test suite
     - [ ] command to run the API server
