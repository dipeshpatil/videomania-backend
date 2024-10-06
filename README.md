# REST APIs for Video Files

## Environment Requirements

1. Node.js - v16

## Installation Steps

1. Clone the Repository

2. Run the install.sh installation script in the root directory

The `install.sh` file is located in the project root directory which contains the required commands to set up the project directory capable for running the code. Ensure you are in the root directory of the project.

Grant Necessary Permissions to the install file

```sh
chmod +x install.sh
```

Run the `install.sh` script to install required dependencies and setting up the project directory

```sh
./install.sh
```

---

If this raises any issues regarding running the script then we can manually setup the project too

```sh
cp .env.sample .env
npm install
```

---

## Running up the Server

Once the Dependencies are installed, we can run the project directly
using the command. This will run the project locally on development mode.

```sh
npm run start
```

## Executing the Tests

The Tests are located in the `tests/video.test.js` file
To run the test, we can use the following command.

```sh
npm test
```

This will run all the tests from the `test/` directory. As of now all the tests are passing according to the validations and checks performed in the code.

## Executing the Endpoints

The Postman Collection is attached in the project root directory, which can be imported in Postman and can get readily started. There are 5 main endpoints

Postman Collection File Name: `API.postman_collection.json`

1. POST `/video/upload` - Upload a Video
2. POST `/video/trim/:videoId` - Trim a Video
3. POST `/video/merge` - Merge a Video
4. POST `/video/share/:videoId` - Generate Share Link for a Video
5. GET `/video/share/:link` - View the Video

This Project Also contains 2 Additional Routes for Debugging Purpose

1. GET `/video/all` - Display Video Titles in DB
2. GET `/video/all-links` - Display Video Links in DB

---

## Application Configuration / Assumptions

1. The Maximum Allowed File Size is **25mb**. This is configurable in `config/constants.json`
2. The Allowed Video Extensions which can be uploaded is **[MP4]**. Any new extensions which needs to be handled, can be added into `config/constants.json`
3. The Minimum and Maximum duration of the video is **5** and **100** seconds respectively, and can be configured in `config/constants.json`
4. The Application Runs on `PORT 3000` by default, this is configurable in `config/constants.json`

## Known Observations

### Merge Videos

1. The Merge API Limits from Merging Videos with different resolutions. The approach was to convert all videos with a common resolution (let us say the first video's resolution can be used to convert the rest of the videos to use that resolutions), but the ffmpeg command to scale the video was was not working. Tried complex filters too but something was missing which I wasn't able to address. Hence the endpoint was limited to merge videos having only same resolutions. [[Reference]](https://stackoverflow.com/questions/57862495/how-to-run-this-complex-filter-in-fluent-ffmpeg)
