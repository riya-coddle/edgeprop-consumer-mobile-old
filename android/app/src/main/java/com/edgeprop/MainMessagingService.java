package com.edgeprop;
import io.invertase.firebase.messaging.*;
import android.content.Intent;
import android.content.Context;
import com.google.firebase.messaging.RemoteMessage;
import android.util.Log;
import java.util.Map;

/**
 * Created by edgeprop on 06/06/18.
 */

public class MainMessagingService extends RNFirebaseMessagingService {
    private static final String TAG = "MainMessagingService";
    
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        Map message = remoteMessage.getData();
    }
}
