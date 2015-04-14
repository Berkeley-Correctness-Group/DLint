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

// Author: Michael Pradel (michael@binaervarianz.de), Liang Gong (gongliang13@cs.berkeley.edu)

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

public class ExperimentRunner {

  // location of Firefox modified for in-browser instrumentation
	//final String firefoxBinary = "thirdparty/instrumenting_firefox";
	final String firefoxBinary = "/Applications/Nightly.app/Contents/MacOS/firefox-bin";
  
  // location of the jalangiFF Firefox plugin
	final String jalangiFFxpi = "thirdparty/jalangiff.xpi";

	final String firefoxLogFile = "/tmp/firefox.out";
	final String javascriptLogFile = "/tmp/firefox_javascript.out";

	String baseUrl = "http://127.0.0.1";
	String bitnamiUrl = "http://127.0.0.1:8081";
	String jbBaseUrl = "http://127.0.0.1:8000";
	WebDriver driver;
	int maxWaitTime = 5 * 60;

	public static void main(String[] args) throws Exception {
		ExperimentRunner runner = new ExperimentRunner();
		runner.setup();
		if (args.length == 1) {
			runner.runOne(args[0]);
		} else if (args.length == 2 && args[0].equals("--url")) {
			runner.runUrl(args[1]);
		} else {
			throw new IllegalArgumentException("need 1 or 2 arguments");
		}

		// runner.runAll();
	}

	public String readFile(String filename) {
	   String content = null;
	   File file = new File(filename); //for ex foo.txt
	   try {
	       FileReader reader = new FileReader(file);
	       char[] chars = new char[(int) file.length()];
	       reader.read(chars);
	       content = new String(chars);
	       reader.close();
	   } catch (IOException e) {
	       e.printStackTrace();
	   }
	   return content;
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
		profile.addExtension(new File(jalangiFFxpi));
		driver = new FirefoxDriver(binary, profile, desiredCapabilities);
		driver.manage().timeouts().implicitlyWait(120, TimeUnit.SECONDS);
	}

	private void runOne(String bm) throws Exception {
		if (bm.equals("joomla")) {
			testJoomla();
		} else if (bm.equals("joomla-admin")) {
			testJoomlaAdmin();
		} else if (bm.equals("moodle")) {
			testMoodle();
		} else if (bm.equals("zurmo")) {
			testZurmo();
		} else if (bm.equals("annex")) {
			testAnnex();
		} else if (bm.equals("calculator")) {
			testCalculator();
		} else if (bm.equals("tenframe")) {
			testTenframe();
		} else if (bm.equals("todolist")) {
			testTodolist();
		} else if (bm.equals("jshint")) {
			testJSHint();
		} else if (bm.equals("jslint")) {
			testJSLint();
		} else if (bm.equals("esprima")) {
			testEsprima();
		} else if (bm.equals("dillinger")) {
			testDillinger();
		} else if (bm.equals("angularjs")) {
			testAngularJS();
		}

		// trigger beforeunload event after last benchmark
		driver.get("http://127.0.0.1:8000/tests/empty.html");
		driver.close();

		System.out.println("Done :-)");
	}

	private String endExecCode = "if (J$ && J$.analysis && J$.analysis.endExecution) try{ J$.analysis.endExecution(); } catch(ex) { alert(ex);}";

	private void runUrl(String url) {
		System.out.println("Loading "+url);
        driver.get(url);
        System.out.println("Done loading "+url);

        // wait a little bit to allow additional js
        // code to be executed
        /* System.out.println("Waiting...");
        try{
        	Thread.sleep(2000);
        	systematicMouseMove();
        	autoScroll();
        } catch (InterruptedException ex) {
        	ex.printStackTrace();
        } catch (Exception ex) {
        	ex.printStackTrace();
        }*/

        System.out.println("Ending execution...");
        JavascriptExecutor jse = (JavascriptExecutor)driver;
        try {
        	jse.executeScript(endExecCode, "");
    	} catch (Exception ex) {
    		System.out.println("!!!exception occurred, analysis.json file is not generated.");
    	}
        //System.out.println("End Executing endExecution() in JavaScript");
        /*
        System.out.println("Trying to find pElement..");
        WebElement pElement = driver.findElement(By.className("jalangiFF-p"));
        System.out.println("pElement: "+pElement);
        pElement.click();
        System.out.println("Have clicked pElement");
		*/

        System.out.println("Waiting...");
        try {
        	Thread.sleep(4000);
        } catch (InterruptedException ex) {
        	ex.printStackTrace();
        }

        driver.close();
        System.out.println("Done :-)");
	}

	protected void systematicMouseMove() {
		try {
			Robot robot = new Robot();
			// focus on the firefox browser
			robot.mouseMove(100,100);
			robot.mousePress(InputEvent.BUTTON1_MASK);
	        robot.mouseRelease(InputEvent.BUTTON1_MASK);
	        // get all descendents of body element
	        WebElement bodyElem = driver.findElement(By.tagName("body"));
			List<WebElement> childs = bodyElem.findElements(By.xpath(".//*"));
			// mouse over at most 50 elements
			int numElem = childs.size();
			int interval = (int)(numElem / 50); 
			interval = interval > 0 ? interval : 1;
			for(int i = 0; i<numElem; i += interval) {
				WebElement element = childs.get(i);
				try {
					// mouse over action
					//robot.mouseMove(loc.x + 5,loc.y + 5);
					Actions actions = new Actions(driver);
					actions.moveToElement(element);
					actions.perform();
					Point loc = element.getLocation();
					System.out.println("Mouse over at: " + loc.x + "," + loc.y);
					pause(500);
				} catch(Exception ex) {
					System.out.println("cannot move to current element...");
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	protected void pause(int milSec) {
		try{
        	Thread.sleep(milSec);
        } catch (InterruptedException ex) {
        	ex.printStackTrace();
        }
	}

	private void runAll() throws Exception {
		// testToyExample();

		testJoomla();
		// testJoomlaAdmin();
		// testCmsmadesimple();
		// testMediawiki();
		// testMoodle();
		// testDokuwiki();
		// testOsclass();
		// testPhpbb();
		// testWordpress();
		// testZurmo();
		// testProcesswire();

		// trigger beforeunload event after last benchmark
		driver.get("http://127.0.0.1:8000/tests/empty.html");

		System.out.println("Done :-)");
	}

	public void testToyExample() throws Exception {
		driver.get("http://127.0.0.1:8000/tests/inconsistentType/inconsistent8.html");
	}

	public void testAnnex() throws Exception {
		driver.get(jbBaseUrl + "/tests/tizen_firefox/annex/");
		driver.findElement(By.id("open1")).click();
		driver.findElement(By.id("a24")).click();
		driver.findElement(By.id("a35")).click();
		driver.findElement(By.id("a15")).click();
		driver.findElement(By.cssSelector("a.configure > img")).click();
		driver.findElement(
				By.cssSelector("div.configure_panel_help > div.configure_panel_text"))
				.click();
		driver.findElement(By.linkText("Go Back")).click();
		driver.findElement(By.cssSelector("a.configure > img")).click();
		driver.findElement(By.cssSelector("div.configure_panel_startover"))
				.click();
		driver.findElement(By.cssSelector("a.configure > img")).click();
		driver.findElement(By.cssSelector("a.configure > img")).click();
	}

	public void testCalculator() throws Exception {
		driver.get(jbBaseUrl + "/tests/tizen_firefox/calculator/");
		driver.findElement(By.id("button2")).click();
		driver.findElement(By.id("button3")).click();
		driver.findElement(By.id("buttonadd")).click();
		driver.findElement(By.id("button6")).click();
		driver.findElement(By.id("buttonequal")).click();
		driver.findElement(By.id("buttonclear")).click();
		driver.findElement(By.id("buttonmemorylist")).click();
		driver.findElement(By.id("buttonM1close")).click();
		driver.findElement(By.id("buttonM1edit")).click();
		driver.findElement(By.id("memoryclearall")).click();
		driver.findElement(By.id("dialogokbutton")).click();
		driver.findElement(By.id("memoryClose")).click();
		driver.findElement(By.id("button4")).click();
		driver.findElement(By.id("button5")).click();
		driver.findElement(By.id("buttonarccos")).click();
		driver.findElement(By.id("buttonsubtract")).click();
		driver.findElement(By.id("buttoninverse")).click();
		driver.findElement(By.id("button8")).click();
		driver.findElement(By.id("buttonequal")).click();
		driver.findElement(By.id("openhistorybutton")).click();
		driver.findElement(By.id("closehistorybutton")).click();
		driver.findElement(By.id("buttonrad")).click();
		driver.findElement(By.id("buttonmemorize")).click();
		driver.findElement(By.id("buttonmemorize")).click();
		driver.findElement(By.id("buttonmemorylist")).click();
		driver.findElement(By.id("buttonM2edit")).click();
		driver.findElement(By.id("mnedescriptioninput")).clear();
		driver.findElement(By.id("mnedescriptioninput")).sendKeys("33");
		driver.findElement(By.id("mnesave")).click();
		driver.findElement(By.id("memoryClose")).click();
		driver.findElement(By.id("buttonclosecurrentformula")).click();
		driver.findElement(By.id("buttonclosemainentry")).click();
	}

	public void testTenframe() throws Exception {
		driver.get(jbBaseUrl + "/tests/tizen_firefox/tenframe/");
		driver.findElement(By.id("home_rockets")).click();
		driver.findElement(By.id("rockets_add3")).click();
		driver.findElement(By.id("rockets_add3")).click();
		driver.findElement(By.id("rockets_add3")).click();
		driver.findElement(By.id("rockets_add4")).click();
		driver.findElement(By.id("rockets_add4")).click();
		driver.findElement(By.id("rockets_add3")).click();
		driver.findElement(By.id("game_menu_tab")).click();
		driver.findElement(By.id("game_menu_home")).click();
		driver.findElement(By.id("home_bowling")).click();
		// driver.findElement(By.id("bowling_rollbutton")).click();
	}

	public void testTodolist() throws Exception {
		driver.get(jbBaseUrl + "/tests/tizen_firefox/todolist/");
		driver.findElement(By.cssSelector("a.day-view-button.ui-link > img"))
				.click();
		driver.findElement(
				By.cssSelector("#dayouter > div.day > div.container > div.header > span.add"))
				.click();
		driver.findElement(
				By.cssSelector("div.editui_buttons > fieldset.save > a > span.text"))
				.click();
		driver.findElement(By.name("text")).clear();
		driver.findElement(By.name("text")).sendKeys("aaa");
		driver.findElement(By.cssSelector("span.text.afternoon")).click();
		driver.findElement(By.cssSelector("#red > img")).click();
		driver.findElement(
				By.cssSelector("div.editui_buttons > fieldset.save > a > span.text"))
				.click();
	}

	public void testCmsmadesimple() throws Exception {
		driver.get(jbBaseUrl + "/cmsmadesimple/");
		driver.findElement(By.cssSelector("a.menuactive > span")).click();
		driver.findElement(By.cssSelector("a.menuparent > span")).click();
		driver.findElement(By.linkText("Pages and navigation")).click();
		driver.findElement(By.linkText("Content")).click();
		driver.findElement(By.xpath("//div[@id='menu_vert']/ul/li[3]/a/span"))
				.click();
		driver.findElement(By.linkText("Simplex Theme")).click();
		driver.findElement(By.linkText("Default Extensions")).click();
		driver.findElement(By.cssSelector("a > span")).click();
		driver.findElement(By.linkText("here")).click();
		driver.findElement(By.id("lbusername")).clear();
		driver.findElement(By.id("lbusername")).sendKeys("user");
		driver.findElement(By.id("lbpassword")).clear();
		driver.findElement(By.id("lbpassword")).sendKeys("password");
		driver.findElement(By.name("loginsubmit")).click();
		driver.findElement(By.xpath("(//a[contains(text(),'Content')])[3]"))
				.click();
		driver.findElement(
				By.xpath("(//a[contains(text(),'Image Manager')])[2]")).click();
		driver.findElement(By.linkText("Global Content Blocks")).click();
		driver.findElement(By.linkText("File Manager")).click();
		driver.findElement(By.linkText("News")).click();
		driver.findElement(By.linkText("Logout")).click();
	}

	// empty results -- unclear why
	public void testDrupal() throws Exception {
		driver.get(baseUrl + "/drupal/");
		driver.findElement(By.linkText("Home")).click();
		driver.findElement(By.linkText("Create new account")).click();
		driver.findElement(By.linkText("Home")).click();
		driver.findElement(By.id("edit-name")).clear();
		driver.findElement(By.id("edit-name")).sendKeys("user");
		driver.findElement(By.id("edit-pass")).clear();
		driver.findElement(By.id("edit-pass")).sendKeys("password");
		driver.findElement(By.id("edit-submit")).click();
		driver.findElement(
				By.cssSelector("div.content > ul.menu.clearfix > li.first.collapsed > a"))
				.click();
		driver.findElement(By.cssSelector("span.label")).click();
		driver.findElement(By.id("edit-title-0-value")).clear();
		driver.findElement(By.id("edit-title-0-value")).sendKeys("asasas");
		driver.findElement(By.id("edit-preview")).click();
		driver.findElement(By.linkText("Home")).click();
		driver.findElement(By.xpath("(//a[contains(text(),'Log out')])[2]"))
				.click();
	}

	public void autoClick() throws Exception {
		System.out.println("start auto-clicking");
		String content = readFile("/Users/jacksongl/macos-workspace/research/jalangi/github_dlint/gitprojects/jalangi-dlint/src/java/evaluation/autoClick.js");
		JavascriptExecutor jse = (JavascriptExecutor)driver;
		jse.executeScript(content, "");
	}

	public void systematicExploreClick() throws Exception {
		JavascriptExecutor jse = (JavascriptExecutor)driver;
		for(int i=0;i<5;i++) {
			autoClick();
			System.out.println("auto scroll down");
			jse.executeScript("window.scrollBy(0,250)", "");
		}
	}

	public void autoScroll() throws Exception {
		JavascriptExecutor jse = (JavascriptExecutor)driver;
		for(int i=0;i<5;i++) {
			System.out.println("auto scroll down");
			jse.executeScript("window.scrollBy(0,250)", "");
		}
		for(int i=0;i<5;i++) {
			System.out.println("auto scroll up");
			jse.executeScript("window.scrollBy(0,-250)", "");
		}
	}

	public void testJSLint() throws Exception {
		System.out.println("http://www.jslint.com/");
		driver.get("http://www.jslint.com/");
		driver.findElement(By.tagName("textarea")).clear();
		String content = readFile("/Users/jacksongl/macos-workspace/research/jalangi/github_dlint/gitprojects/jalangi/src/js/RecordReplayEngine.js");
		driver.findElement(By.tagName("textarea")).sendKeys(content);
		driver.findElement(By.id("JSLINT_BUTTON")).click();
	}

	public void testAngularJS() throws Exception {
		System.out.println("https://angularjs.org/");
		driver.get("https://angularjs.org/");
		systematicExploreClick();
	}

	public void testEsprima() throws Exception {
		System.out.println("http://esprima.org/demo/parse.html");
		driver.get("http://esprima.org/demo/parse.html");
		systematicExploreClick();
	}

	public void testDillinger() throws Exception {
		System.out.println("http://dillinger.io/");
		driver.get("http://dillinger.io/");
	}

	public void testJSHint() throws Exception {
		System.out.println("http://www.jshint.com/");
		driver.get("http://www.jshint.com/");
		systematicExploreClick();
	}

	public void testJoomla() throws Exception {
		System.out.println(bitnamiUrl + "/joomla/");
		driver.get(bitnamiUrl + "/joomla/");
		driver.findElement(By.linkText("Home")).click();
		driver.findElement(By.linkText("Create an account")).click();
		driver.findElement(By.linkText("Cancel")).click();
		driver.findElement(By.linkText("Forgot your username?")).click();
		driver.findElement(By.linkText("Getting Started")).click();
		// log in
		driver.findElement(By.id("modlgn-username")).clear();
		driver.findElement(By.id("modlgn-username")).sendKeys("username");
		driver.findElement(By.id("modlgn-passwd")).clear();
		driver.findElement(By.id("modlgn-passwd")).sendKeys("password");
		driver.findElement(By.name("Submit")).click();
		// go to the homepage
		driver.findElement(By.linkText("Home")).click();
		// submit an article
		
		driver.findElement(By.linkText("Submit an Article")).click();
		driver.findElement(By.id("jform_title")).clear();
		driver.findElement(By.id("jform_title")).sendKeys("article-title-" + new Date());
		driver.findElement(By.id("jform_alias")).clear();
		driver.findElement(By.id("jform_alias")).sendKeys("article-alias-" + new Date());
		driver.findElement(By.xpath("//a[@title='Read More']")).click();
		driver.findElement(By.xpath("//a[@title='Toggle editor']")).click();
		driver.findElement(By.xpath("//a[@title='Article']")).click();

		// site administration
		driver.findElement(By.linkText("Site Administrator")).click();
		driver.findElement(By.id("mod-login-username")).clear();
		driver.findElement(By.id("mod-login-username")).sendKeys("username");
		driver.findElement(By.id("mod-login-password")).clear();
		driver.findElement(By.id("mod-login-password")).sendKeys("password");
		driver.findElement(By.xpath("//button[@tabindex='3']")).click();

		driver.get(bitnamiUrl + "/joomla/administrator/index.php?option=com_media#");
		driver.findElement(By.id("thumbs")).click();
		driver.findElement(By.xpath("//button[@data-target='#collapseFolder']")).click();
		driver.findElement(By.id("foldername")).clear();
		driver.findElement(By.id("foldername")).sendKeys("test-folder-" + Math.random());
		driver.findElement(By.xpath("//button[@type='submit']")).click();

		driver.findElement(By.id("details")).click();
		driver.findElement(By.xpath("//button[@data-target='#collapseUpload']")).click();
		systematicExploreClick();
	}

	public void testJoomlaAdmin() throws Exception {
		driver.get(baseUrl + "/joomla/administrator/");
		driver.findElement(By.id("mod-login-username")).clear();
		driver.findElement(By.id("mod-login-username")).sendKeys("user");
		driver.findElement(By.id("mod-login-password")).clear();
		driver.findElement(By.id("mod-login-password")).sendKeys("password");
		driver.findElement(
				By.xpath("//form[@id='form-login']/fieldset/div[4]/div/div/button"))
				.click();
		driver.findElement(By.cssSelector("span.icon-cog")).click();
		driver.findElement(By.linkText("Logout")).click();

	}

	public void testMediawiki() throws Exception {
		driver.get(baseUrl + "/mediawiki/index.php/Main_Page");
		driver.findElement(By.linkText("Main page")).click();
		driver.findElement(By.linkText("Recent changes")).click();
		driver.findElement(By.linkText("Random page")).click();
		driver.findElement(By.linkText("Main page")).click();
		driver.findElement(By.linkText("Log in")).click();
		driver.findElement(By.id("wpName1")).clear();
		driver.findElement(By.id("wpName1")).sendKeys("user");
		driver.findElement(By.id("wpPassword1")).clear();
		driver.findElement(By.id("wpPassword1")).sendKeys("password");
		driver.findElement(By.id("wpLoginAttempt")).click();
		driver.findElement(By.linkText("Edit")).click();
		driver.findElement(By.id("wpSave")).click();
		driver.findElement(By.linkText("Preferences")).click();
		driver.findElement(By.id("preftab-editing")).click();
		driver.findElement(By.id("preftab-rendering")).click();
		driver.findElement(By.linkText("Log out")).click();
	}

	public void testMoodle() throws Exception {
		driver.get(baseUrl + "/moodle/");
		driver.findElement(By.cssSelector("#page-footer > div.logininfo > a"))
				.click();
		driver.findElement(By.id("username")).click();
		driver.findElement(By.id("username")).clear();
		driver.findElement(By.id("username")).sendKeys("user");
		driver.findElement(By.id("password")).clear();
		driver.findElement(By.id("password")).sendKeys("password");
		driver.findElement(By.id("loginbtn")).click();
		driver.findElement(By.linkText("My home")).click();
		driver.findElement(By.linkText("My courses")).click();
		driver.findElement(By.linkText("Courses")).click();
		driver.findElement(By.cssSelector("input[type=\"submit\"]")).click();
		driver.findElement(By.linkText("Create new category")).click();
		driver.findElement(By.id("id_cancel")).click();
		driver.findElement(By.linkText("Log out")).click();
	}

	// empty results -- unclear why
	public void testOwncloud() throws Exception {
		driver.get(baseUrl + "/owncloud/");
		driver.findElement(By.id("user")).click();
		driver.findElement(By.id("user")).clear();
		driver.findElement(By.id("user")).sendKeys("user");
		driver.findElement(
				By.cssSelector("p.infield.groupbottom > label.infield"))
				.click();
		driver.findElement(By.id("password")).click();
		driver.findElement(By.id("password")).clear();
		driver.findElement(By.id("password")).sendKeys("password");
		driver.findElement(By.id("submit")).click();
		// ERROR: Caught exception [ERROR: Unsupported command [selectWindow |
		// name=dir | ]]
		driver.findElement(By.xpath("//ul[@id='apps']/div/li[2]/a/img"))
				.click();
		// ERROR: Caught exception [ERROR: Unsupported command [selectWindow |
		// name=dir | ]]
		driver.findElement(By.xpath("//ul[@id='apps']/div/li[3]/a/img"))
				.click();
		// ERROR: Caught exception [ERROR: Unsupported command [selectWindow |
		// name=dir | ]]
		driver.findElement(By.xpath("//ul[@id='apps']/div/li[4]/a/img"))
				.click();
		// ERROR: Caught exception [ERROR: Unsupported command [selectWindow |
		// name=dir | ]]
		driver.findElement(By.xpath("//ul[@id='apps']/div/li[5]/a/img"))
				.click();
		// ERROR: Caught exception [ERROR: Unsupported command [selectWindow |
		// name=dir | ]]
		driver.findElement(By.xpath("//ul[@id='apps']/div/li[6]/a/img"))
				.click();
		// ERROR: Caught exception [ERROR: Unsupported command [selectWindow |
		// name=dir | ]]
		driver.findElement(By.cssSelector("#expand > img.svg")).click();
		// ERROR: Caught exception [ERROR: Unsupported command [selectWindow |
		// name=dir | ]]
		// driver.findElement(By.id("logout")).click();
	}

	public void testDokuwiki() throws Exception {
		driver.get(baseUrl + "/dokuwiki/doku.php");
		driver.findElement(By.cssSelector("div.trace")).click();
		driver.findElement(By.cssSelector("img")).click();
		driver.findElement(By.linkText("Recent changes")).click();
		driver.findElement(By.linkText("Media Manager")).click();
		driver.findElement(By.linkText("Sitemap")).click();
		driver.findElement(By.linkText("Login")).click();
		driver.findElement(By.id("focus__this")).click();
		driver.findElement(By.id("focus__this")).clear();
		driver.findElement(By.id("focus__this")).sendKeys("user");
		driver.findElement(By.name("p")).clear();
		driver.findElement(By.name("p")).sendKeys("password");
		driver.findElement(By.cssSelector("fieldset > input.button")).click();
		driver.findElement(By.linkText("Update Profile")).click();
		driver.findElement(By.linkText("Admin")).click();
		driver.findElement(By.linkText("User Manager")).click();
		driver.findElement(By.linkText("Admin")).click();
		driver.findElement(By.linkText("Access Control List Management"))
				.click();
		driver.findElement(By.linkText("Admin")).click();
		driver.findElement(By.linkText("Manage Plugins")).click();
		driver.findElement(By.linkText("Admin")).click();
		driver.findElement(By.linkText("Configuration Settings")).click();
		driver.findElement(By.linkText("Admin")).click();
		driver.findElement(By.linkText("Logout")).click();
	}

	public void testOsclass() throws Exception {
		driver.get(baseUrl + "/osclass/");
		driver.findElement(By.cssSelector("img[alt=\"Sample Web Page\"]"))
				.click();
		driver.findElement(By.linkText("Animals")).click();
		driver.findElement(By.linkText("Example Ad")).click();
		driver.findElement(By.id("login_open")).click();
		driver.findElement(By.id("email")).clear();
		driver.findElement(By.id("email")).sendKeys("user");
		driver.findElement(By.id("password")).clear();
		driver.findElement(By.id("password")).sendKeys("password");
		driver.findElement(By.xpath("//button[@type='submit']")).click();
		driver.findElement(By.cssSelector("div.actions > a")).click();
	}

	public void testPhpbb() throws Exception {
		driver.get(baseUrl + "/phpbb/");
		driver.findElement(By.linkText("FAQ")).click();
		driver.findElement(By.linkText("Why do I need to register at all?"))
				.click();
		driver.findElement(By.xpath("(//a[contains(text(),'Top')])[2]"))
				.click();
		driver.findElement(By.cssSelector("img")).click();
		driver.findElement(By.linkText("Your first forum")).click();
		driver.findElement(By.linkText("Welcome to phpBB3")).click();
		driver.findElement(By.cssSelector("dt > a.username-coloured")).click();
		driver.findElement(By.linkText("Login")).click();
		driver.findElement(By.id("username")).clear();
		driver.findElement(By.id("username")).sendKeys("user");
		driver.findElement(By.id("password")).clear();
		driver.findElement(By.id("password")).sendKeys("password");
		driver.findElement(By.name("login")).click();
		driver.findElement(By.linkText("View your posts")).click();
		driver.findElement(By.linkText("Logout [ user ]")).click();
	}

	public void testWordpress() throws Exception {
		driver.get(baseUrl + "/wordpress/");
		driver.findElement(By.linkText("Hello world!")).click();
		driver.findElement(By.linkText("Log in")).click();
		driver.findElement(By.id("user_login")).clear();
		driver.findElement(By.id("user_login")).sendKeys("user");
		driver.findElement(By.id("user_pass")).clear();
		driver.findElement(By.id("user_pass")).sendKeys("password");
		driver.findElement(By.id("wp-submit")).click();
		driver.findElement(
				By.cssSelector("#wp-admin-bar-new-content > a.ab-item > span.ab-label"))
				.click();
		driver.findElement(By.linkText("Howdy, user")).click();
	}

	// triggers some Jalangi bug
	public void testRoundcube() throws Exception {
		driver.get(baseUrl + "/roundcube/?_task=logout");
		driver.findElement(By.id("rcmloginuser")).clear();
		driver.findElement(By.id("rcmloginuser")).sendKeys("reelnaheemji");
		driver.findElement(By.id("rcmloginpwd")).clear();
		driver.findElement(By.id("rcmloginpwd")).sendKeys("ijmeehanleer");
		driver.findElement(By.cssSelector("input.button.mainaction")).click();
		driver.findElement(By.cssSelector("span.button-inner")).click();
		driver.findElement(By.cssSelector("#rcmbtn103 > span.button-inner"))
				.click();
		driver.findElement(By.id("rcmbtn101")).click();
	}

	public void testZurmo() throws Exception {
		driver.get(baseUrl + "/zurmo/app/index.php/zurmo/default/login");
		driver.findElement(By.id("LoginForm_username")).clear();
		driver.findElement(By.id("LoginForm_username")).sendKeys("user");
		driver.findElement(By.id("LoginForm_password")).clear();
		driver.findElement(By.id("LoginForm_password")).sendKeys("password");
		// remainder doesn't work with Jalangi-instrumented page -- unclear why
		// driver.findElement(By.cssSelector(".z-label")).click();
		// driver.findElement(By.xpath("//li[@id='mashableInbox']/a/span[2]"))
		// .click();
		// driver.findElement(By.xpath("//li[@id='accounts']/a/span[2]")).click();
		// driver.findElement(By.xpath("//li[@id='leads']/a/span[2]")).click();
		// driver.findElement(By.xpath("//li[@id='contacts']/a/span[2]")).click();
		// driver.findElement(By.xpath("//li[@id='opportunities']/a/span[2]"))
		// .click();
		// driver.findElement(By.linkText("user")).click();
		// driver.findElement(By.linkText("Sign out")).click();
	}

	public void testProcesswire() throws Exception {
		driver.get(baseUrl + "/processwire/");
		driver.get(baseUrl + "/processwire/about/");
		driver.get(baseUrl + "/processwire/templates/");
		driver.get(baseUrl + "/processwire/site-map/");
	}
}
