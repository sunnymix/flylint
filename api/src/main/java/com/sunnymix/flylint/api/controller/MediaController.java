package com.sunnymix.flylint.api.controller;

import com.aliyun.oss.ClientException;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.model.PutObjectRequest;
import com.sunnymix.flylint.api.common.Id;
import com.sunnymix.flylint.api.common.io.Out;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

/**
 * @author sunnymix
 */
@RequestMapping("/media")
@RestController
public class MediaController {

    @Value("${oss.endpoint}")
    private String endpoint;

    @Value("${oss.bucket}")
    private String bucket;

    @Value("${oss.basePath}")
    private String basePath;

    @Value("${oss.readPath}")
    private String readPath;

    @Value("${oss.accessKeyId}")
    private String accessKeyId;

    @Value("${oss.accessKeySecret}")
    private String accessKeySecret;

    @RequestMapping("/image/upload")
    public Out<String> uploadImage(@RequestParam("image") MultipartFile image[]) throws IOException {
        if (image.length == 0) return Out.error();

        var filename = image[0].getOriginalFilename();
        var targetFilename = Id.randomFilename(filename);
        var dest = new File("/tmp/sunnymix/media/upload/" + targetFilename);

        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdirs();
        }
        if (dest.exists()) {
            dest.delete();
        }

        image[0].transferTo(dest);
        uploadImageToOss(dest, targetFilename);
        dest.delete();
        var imageUrl = readPath + targetFilename;
        // TODO: create media object

        return Out.ok(imageUrl);
    }

    private void uploadImageToOss(File file, String newImgFilename) throws OSSException, ClientException {
        var objectName = basePath + "/" + newImgFilename;
        var ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);

        var putObjectRequest = new PutObjectRequest(bucket, objectName, file);
        ossClient.putObject(putObjectRequest);

        ossClient.shutdown();
    }

}
