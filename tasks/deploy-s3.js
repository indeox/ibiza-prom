var s3 = require('s3');

var client = s3.createClient({
  s3Options: {
    accessKeyId: "",
    secretAccessKey: "",
    region: "eu-west-1"
  }
});


var params = {
  localDir: "./build",
  deleteRemoved: true, // default false, whether to remove s3 objects
                       // that have no corresponding local file.

  s3Params: {
    Bucket: "ibizaprom",
    ACL: "public-read"
    // Prefix: "www",
    // other options supported by putObject, except Body and ContentLength.
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
  },
};

var uploader = client.uploadDir(params);
uploader.on('error', function(err) {
  console.error("unable to sync:", err.stack);
});
uploader.on('progress', function() {
  console.log("progress", uploader.progressAmount, uploader.progressTotal);
});
uploader.on('end', function() {
  console.log("done uploading");
});
