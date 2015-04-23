/*
 * Copyright 2014 University of California, Berkeley.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Author: Liang Gong (gongliang13@cs.berkeley.edu)

// command to compile this code:
// javac -d thirdparty -cp thirdparty/selenium-server-standalone-2.41.0.jar ./src/java/evaluation/ExperimentRunner.java

package evaluation;

import java.io.File;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxBinary;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.logging.LogType;
import org.openqa.selenium.logging.LoggingPreferences;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.Point;
import java.awt.event.InputEvent;
import java.awt.Robot;
import java.util.*;
import java.math.*;
import java.io.*;

import com.thoughtworks.selenium.webdriven.commands.WaitForPageToLoad;

public class JalangiFirefoxRunner {

  // location of Firefox modified for in-browser instrumentation
	//final String firefoxBinary = "thirdparty/instrumenting_firefox";
	private static String curDIR;
	private static String firefoxBinary;

	final String firefoxLogFile = "/tmp/firefox.out";
	final String javascriptLogFile = "/tmp/firefox_javascript.out";
	WebDriver driver;
	int maxWaitTime = 5 * 60;

	public static void main(String[] args) throws Exception {
		init();
		JalangiFirefoxRunner runner = new JalangiFirefoxRunner();
		runner.setup();
		runner.runUrl();

		// runner.runAll();
	}

	private static void init() {
		try{
			curDIR = new java.io.File( "." ).getCanonicalPath();
		}catch(Exception ex) {
			System.out.println(ex);
		}
		firefoxBinary = curDIR + "/Nightly.app/Contents/MacOS/firefox-bin";
	}

	private void setup() throws Exception {
		DesiredCapabilities desiredCapabilities = DesiredCapabilities.firefox();
		LoggingPreferences loggingPreferences = new LoggingPreferences();
		loggingPreferences.enable(LogType.BROWSER, Level.ALL);
		desiredCapabilities.setCapability(CapabilityType.LOGGING_PREFS,
				loggingPreferences);
		FirefoxBinary binary = new FirefoxBinary(new File(firefoxBinary));
		FirefoxProfile profile = new FirefoxProfile();
		System.setProperty("webdriver.firefox.logfile", firefoxLogFile);
		profile.setPreference("webdriver.log.file", javascriptLogFile);
		profile.setPreference("dom.max_script_run_time", maxWaitTime);
		// Do not divert any links (browser.link.open_newwindow will have no effect). 
		// http://kb.mozillazine.org/Browser.link.open_newwindow.restriction
		profile.setPreference("dom.popup_allowed_events", "");
		profile.setPreference("dom.popup_maximum", 0);
		driver = new FirefoxDriver(binary, profile, desiredCapabilities);
		driver.manage().timeouts().implicitlyWait(120, TimeUnit.SECONDS);
	}

	private void runUrl() {

	}
}
