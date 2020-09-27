from . import Controller
import pkg_resources
from string import Template
from owrx.config import Config


class TemplateController(Controller):
    def render_template(self, file, **vars):
        file_content = pkg_resources.resource_string("htdocs", file).decode("utf-8")
        template = Template(file_content)

        return template.safe_substitute(**vars)

    def serve_template(self, file, **vars):
        self.send_response(self.render_template(file, **vars), content_type="text/html")

    def default_variables(self):
        return {}


class WebpageController(TemplateController):
    def template_variables(self):
        settingslink = ""
        pm = Config.get()
        if "webadmin_enabled" in pm and pm["webadmin_enabled"]:
            settingslink = """<div class="openwebrx-panel-line openwebrx-panel-flex-line">
                                  <div class="openwebrx-settings-text">Admin settings:</div>
                                  <a class="openwebrx-button" href="settings" target="openwebrx-settings">Login</a>
                              </div>"""
        header = self.render_template("include/header.include.html")
        return {"header": header, "settingslink": settingslink}


class IndexController(WebpageController):
    def indexAction(self):
        self.serve_template("index.html", **self.template_variables())


class MapController(WebpageController):
    def indexAction(self):
        # TODO check if we have a google maps api key first?
        self.serve_template("map.html", **self.template_variables())


class FeatureController(WebpageController):
    def indexAction(self):
        self.serve_template("features.html", **self.template_variables())
