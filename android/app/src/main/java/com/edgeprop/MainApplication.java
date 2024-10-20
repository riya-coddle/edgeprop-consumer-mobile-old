package my.com.theedgeproperty.app;

import android.app.Application;

import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import com.reactlibrary.RNDfpPackage;
import io.realm.react.RealmReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.facebook.react.ReactApplication;
import com.airbnb.android.react.maps.MapsPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.react.ReactNativeHost;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import com.facebook.react.shell.MainReactPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.soloader.SoLoader;
import io.invertase.firebase.RNFirebasePackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.CallbackManager;
import com.appsflyer.reactnative.RNAppsFlyerPackage;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RNGoogleSigninPackage(),
          new SplashScreenReactPackage(),
          new RNFirebaseAnalyticsPackage(),
          new MapsPackage(),
          new RNFetchBlobPackage(),
          new FBSDKPackage(mCallbackManager),
          new RNAppsFlyerPackage(),
          new RealmReactPackage(),
          new RNVersionNumberPackage(),
          new VectorIconsPackage(),
          new RNFirebasePackage(),
          new RNDfpPackage(),
          new RNFirebaseMessagingPackage(),
          new RNSharePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
