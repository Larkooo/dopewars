import UIKit
import WebKit

var webView: WKWebView! = nil

class ViewController: UIViewController, WKNavigationDelegate, UIDocumentInteractionControllerDelegate {

    var documentController: UIDocumentInteractionController?
    func documentInteractionControllerViewControllerForPreview(_ controller: UIDocumentInteractionController) -> UIViewController {
        return self
    }

    @IBOutlet weak var loadingView: UIView!
    @IBOutlet weak var progressView: UIProgressView!
    @IBOutlet weak var connectionProblemView: UIImageView!
    @IBOutlet weak var webviewView: UIView!
    var toolbarView: UIToolbar!

    var logoImageView: UIImageView?
    var htmlIsLoaded = false

    private var themeObservation: NSKeyValueObservation?
    var currentWebViewTheme: UIUserInterfaceStyle = .unspecified

    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }

    override var prefersStatusBarHidden: Bool {
        return false // Show status bar area with background color
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        // Set dark green background (#182218)
        let bgColor = UIColor(red: 24/255, green: 34/255, blue: 24/255, alpha: 1)
        view.backgroundColor = bgColor
        webviewView.backgroundColor = bgColor
        loadingView.backgroundColor = .clear
        loadingView.superview?.backgroundColor = bgColor

        // Hide the progress bar
        progressView.isHidden = true

        // Setup and start pulsating animation
        setupLogoAnimation()

        // Initialize WebView and toolbar
        initWebView()
        initToolbarView()

        // Load the URL
        loadRootUrl()

        NotificationCenter.default.addObserver(self, selector: #selector(self.keyboardWillHide(_:)), name: UIResponder.keyboardWillHideNotification, object: nil)
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        DopeWars.webView.frame = calcWebviewFrame(webviewView: webviewView, toolbarView: nil)
    }

    @objc func keyboardWillHide(_ notification: NSNotification) {
        DopeWars.webView.setNeedsLayout()
    }

    func setupLogoAnimation() {
        if let imageView = findLogoImageView(in: loadingView) {
            logoImageView = imageView
            startPulsatingAnimation()
        }
    }

    func findLogoImageView(in view: UIView) -> UIImageView? {
        for subview in view.subviews {
            if let imageView = subview as? UIImageView, imageView != connectionProblemView {
                return imageView
            }
            if let found = findLogoImageView(in: subview) {
                return found
            }
        }
        return nil
    }

    func startPulsatingAnimation() {
        guard let logo = logoImageView else { return }

        logo.transform = .identity
        logo.alpha = 1.0

        UIView.animate(
            withDuration: 0.8,
            delay: 0,
            options: [.repeat, .autoreverse, .curveEaseInOut],
            animations: {
                logo.transform = CGAffineTransform(scaleX: 1.15, y: 1.15)
            },
            completion: nil
        )
    }

    func initWebView() {
        DopeWars.webView = createWebView(container: webviewView, WKSMH: self, WKND: self)
        webviewView.addSubview(DopeWars.webView)

        DopeWars.webView.uiDelegate = self
        DopeWars.webView.addObserver(self, forKeyPath: #keyPath(WKWebView.estimatedProgress), options: .new, context: nil)

        if pullToRefresh {
            #if !targetEnvironment(macCatalyst)
            let refreshControl = UIRefreshControl()
            refreshControl.addTarget(self, action: #selector(refreshWebView(_:)), for: .valueChanged)
            DopeWars.webView.scrollView.addSubview(refreshControl)
            DopeWars.webView.scrollView.bounces = true
            #endif
        }

        if #available(iOS 15.0, *), adaptiveUIStyle {
            themeObservation = DopeWars.webView.observe(\.underPageBackgroundColor) { [unowned self] webView, _ in
                currentWebViewTheme = DopeWars.webView.underPageBackgroundColor.isLight() ?? true ? .light : .dark
                self.overrideUIStyle()
            }
        }

        // Bring loading view to front
        view.bringSubviewToFront(loadingView.superview ?? loadingView)
    }

    @objc func refreshWebView(_ sender: UIRefreshControl) {
        DopeWars.webView?.reload()
        sender.endRefreshing()
    }

    func createToolbarView() -> UIToolbar {
        let winScene = UIApplication.shared.connectedScenes.first
        let windowScene = winScene as! UIWindowScene
        var statusBarHeight = windowScene.statusBarManager?.statusBarFrame.height ?? 60

        #if targetEnvironment(macCatalyst)
        if statusBarHeight == 0 {
            statusBarHeight = 30
        }
        #endif

        let toolbarView = UIToolbar(frame: CGRect(x: 0, y: 0, width: webviewView.frame.width, height: 0))
        toolbarView.sizeToFit()
        toolbarView.frame = CGRect(x: 0, y: 0, width: webviewView.frame.width, height: toolbarView.frame.height + statusBarHeight)

        let flex = UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: nil, action: nil)
        let close = UIBarButtonItem(barButtonSystemItem: .done, target: self, action: #selector(loadRootUrl))
        toolbarView.setItems([close, flex], animated: true)

        toolbarView.isHidden = true

        return toolbarView
    }

    func overrideUIStyle(toDefault: Bool = false) {
        if #available(iOS 15.0, *), adaptiveUIStyle {
            if ((htmlIsLoaded && !DopeWars.webView.isHidden) || toDefault) && self.currentWebViewTheme != .unspecified {
                UIApplication
                    .shared
                    .connectedScenes
                    .flatMap { ($0 as? UIWindowScene)?.windows ?? [] }
                    .first { $0.isKeyWindow }?.overrideUserInterfaceStyle = toDefault ? .unspecified : self.currentWebViewTheme
            }
        }
    }

    func initToolbarView() {
        toolbarView = createToolbarView()
        webviewView.addSubview(toolbarView)
    }

    @objc func loadRootUrl() {
        DopeWars.webView.load(URLRequest(url: SceneDelegate.universalLinkToLaunch ?? SceneDelegate.shortcutLinkToLaunch ?? rootUrl))
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        htmlIsLoaded = true

        animateConnectionProblem(false)

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            DopeWars.webView.isHidden = false

            // Stop pulsating and hide loading view
            self.logoImageView?.layer.removeAllAnimations()

            UIView.animate(
                withDuration: 0.4,
                delay: 0,
                options: [.curveEaseOut],
                animations: {
                    self.loadingView.alpha = 0
                },
                completion: { _ in
                    self.loadingView.isHidden = true
                }
            )

            self.overrideUIStyle()
        }
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        htmlIsLoaded = false

        if (error as NSError)._code != (-999) {
            self.overrideUIStyle(toDefault: true)

            webView.isHidden = true
            loadingView.isHidden = false
            loadingView.alpha = 1
            animateConnectionProblem(true)

            DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                    self.loadRootUrl()
                }
            }
        }
    }

    override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
        // Progress observation (not used since progress bar is hidden)
    }

    func animateConnectionProblem(_ show: Bool) {
        if show {
            connectionProblemView.isHidden = false
            connectionProblemView.alpha = 0
            UIView.animate(withDuration: 0.7, delay: 0, options: [.repeat, .autoreverse], animations: {
                self.connectionProblemView.alpha = 1
            })
        } else {
            UIView.animate(withDuration: 0.3, delay: 0, options: [], animations: {
                self.connectionProblemView.alpha = 0
            }, completion: { _ in
                self.connectionProblemView.isHidden = true
                self.connectionProblemView.layer.removeAllAnimations()
            })
        }
    }

    deinit {
        DopeWars.webView.removeObserver(self, forKeyPath: #keyPath(WKWebView.estimatedProgress))
    }
}

extension UIColor {
    func isLight(threshold: Float = 0.5) -> Bool? {
        let originalCGColor = self.cgColor
        let RGBCGColor = originalCGColor.converted(to: CGColorSpaceCreateDeviceRGB(), intent: .defaultIntent, options: nil)
        guard let components = RGBCGColor?.components else {
            return nil
        }
        guard components.count >= 3 else {
            return nil
        }
        let brightness = Float(((components[0] * 299) + (components[1] * 587) + (components[2] * 114)) / 1000)
        return (brightness > threshold)
    }
}

extension ViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "print" {
            printView(webView: DopeWars.webView)
        }
        if message.name == "push-subscribe" {
            handleSubscribeTouch(message: message)
        }
        if message.name == "push-permission-request" {
            handlePushPermission()
        }
        if message.name == "push-permission-state" {
            handlePushState()
        }
        if message.name == "push-token" {
            handleFCMToken()
        }
        if message.name == "cartridge-logout-cleanup" {
            clearCartridgeWebsiteData()
        }
    }
}
