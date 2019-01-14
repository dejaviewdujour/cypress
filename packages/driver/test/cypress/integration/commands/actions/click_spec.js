/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = Cypress.$.bind(Cypress);
const { _ } = Cypress;
const { Promise } = Cypress;

const fail = function(str) {
  throw new Error(str);
};

describe("src/cy/commands/actions/click", function() {
  before(() =>
    cy
      .visit("/fixtures/dom.html")
      .then(function(win) {
        return this.body = win.document.body.outerHTML;
    })
  );

  beforeEach(function() {
    const doc = cy.state("document");

    return $(doc.body).empty().html(this.body);
  });

  context("#click", function() {
    it("receives native click event", function(done) {
      const $btn = cy.$$("#button");

      $btn.on("click", e => {
        const { fromViewport } = Cypress.dom.getElementCoordinatesByPosition($btn);

        const obj = _.pick(e.originalEvent, "bubbles", "cancelable", "view", "button", "buttons", "which", "relatedTarget", "altKey", "ctrlKey", "shiftKey", "metaKey", "detail", "type");
        expect(obj).to.deep.eq({
          bubbles: true,
          cancelable: true,
          view: cy.state("window"),
          button: 0,
          buttons: 0,
          which: 1,
          relatedTarget: null,
          altKey: false,
          ctrlKey: false,
          shiftKey: false,
          metaKey: false,
          detail: 1,
          type: "click"
        });

        expect(e.clientX).to.be.closeTo(fromViewport.x, 1);
        expect(e.clientY).to.be.closeTo(fromViewport.y, 1);
        return done();
      });

      return cy.get("#button").click();
    });

    it("bubbles up native click event", function(done) {
      var click = e => {
        cy.state("window").removeEventListener("click", click);
        return done();
      };

      cy.state("window").addEventListener("click", click);

      return cy.get("#button").click();
    });

    it("sends native mousedown event", function(done) {
      const $btn = cy.$$("#button");

      const win = cy.state("window");

      $btn.get(0).addEventListener("mousedown", function(e) {
        //# calculate after scrolling
        const { fromViewport } = Cypress.dom.getElementCoordinatesByPosition($btn);

        const obj = _.pick(e, "bubbles", "cancelable", "view", "button", "buttons", "which", "relatedTarget", "altKey", "ctrlKey", "shiftKey", "metaKey", "detail", "type");
        expect(obj).to.deep.eq({
          bubbles: true,
          cancelable: true,
          view: win,
          button: 0,
          buttons: 1,
          which: 1,
          relatedTarget: null,
          altKey: false,
          ctrlKey: false,
          shiftKey: false,
          metaKey: false,
          detail: 1,
          type: "mousedown"
        });

        expect(e.clientX).to.be.closeTo(fromViewport.x, 1);
        expect(e.clientY).to.be.closeTo(fromViewport.y, 1);
        return done();
      });

      return cy.get("#button").click();
    });

    it("sends native mouseup event", function(done) {
      const $btn = cy.$$("#button");

      const win = cy.state("window");

      $btn.get(0).addEventListener("mouseup", function(e) {
        const { fromViewport } = Cypress.dom.getElementCoordinatesByPosition($btn);

        const obj = _.pick(e, "bubbles", "cancelable", "view", "button", "buttons", "which", "relatedTarget", "altKey", "ctrlKey", "shiftKey", "metaKey", "detail", "type");
        expect(obj).to.deep.eq({
          bubbles: true,
          cancelable: true,
          view: win,
          button: 0,
          buttons: 0,
          which: 1,
          relatedTarget: null,
          altKey: false,
          ctrlKey: false,
          shiftKey: false,
          metaKey: false,
          detail: 1,
          type: "mouseup"
        });

        expect(e.clientX).to.be.closeTo(fromViewport.x, 1);
        expect(e.clientY).to.be.closeTo(fromViewport.y, 1);
        return done();
      });

      return cy.get("#button").click();
    });

    it("sends mousedown, mouseup, click events in order", function() {
      const events = [];

      const $btn = cy.$$("#button");

      _.each("mousedown mouseup click".split(" "), event =>
        $btn.get(0).addEventListener(event, () => events.push(event))
      );

      return cy.get("#button").click().then(() => expect(events).to.deep.eq(["mousedown", "mouseup", "click"]));
  });

    it("records correct clientX when el scrolled", function(done) {
      const $btn = $("<button id='scrolledBtn' style='position: absolute; top: 1600px; left: 1200px; width: 100px;'>foo</button>").appendTo(cy.$$("body"));

      const win = cy.state("window");

      $btn.get(0).addEventListener("click", e => {
        const { fromViewport } = Cypress.dom.getElementCoordinatesByPosition($btn);

        expect(win.pageXOffset).to.be.gt(0);
        expect(e.clientX).to.be.closeTo(fromViewport.x, 1);
        return done();
      });

      return cy.get("#scrolledBtn").click();
    });

    it("records correct clientY when el scrolled", function(done) {
      const $btn = $("<button id='scrolledBtn' style='position: absolute; top: 1600px; left: 1200px; width: 100px;'>foo</button>").appendTo(cy.$$("body"));

      const win = cy.state("window");

      $btn.get(0).addEventListener("click", e => {
        const { fromViewport } = Cypress.dom.getElementCoordinatesByPosition($btn);

        expect(win.pageYOffset).to.be.gt(0);
        expect(e.clientY).to.be.closeTo(fromViewport.y, 1);
        return done();
      });

      return cy.get("#scrolledBtn").click();
    });

    it("will send all events even mousedown is defaultPrevented", function() {
      const events = [];

      const $btn = cy.$$("#button");

      $btn.get(0).addEventListener("mousedown", function(e) {
        e.preventDefault();
        return expect(e.defaultPrevented).to.be.true;
      });

      _.each("mouseup click".split(" "), event =>
        $btn.get(0).addEventListener(event, () => events.push(event))
      );

      return cy.get("#button").click().then(() => expect(events).to.deep.eq(["mouseup", "click"]));
  });

    it("sends a click event", function(done) {
      cy.$$("#button").click(() => done());

      return cy.get("#button").click();
    });

    it("returns the original subject", function() {
      const button = cy.$$("#button");

      return cy.get("#button").click().then($button => expect($button).to.match(button));
    });

    it("causes focusable elements to receive focus", function(done) {
      const $text = cy.$$(":text:first");

      $text.focus(() => done());

      return cy.get(":text:first").click();
    });

    it("does not fire a focus, mouseup, or click event when element has been removed on mousedown", function() {
      const $btn = cy.$$("button:first");

      $btn.on("mousedown", function() {
        //# synchronously remove this button
        return $(this).remove();
      });

      $btn.on("focus", () => fail("should not have gotten focus"));
      $btn.on("focusin", () => fail("should not have gotten focusin"));
      $btn.on("mouseup", () => fail("should not have gotten mouseup"));
      $btn.on("click", () => fail("should not have gotten click"));

      return cy.contains("button").click();
    });

    it("does not fire a click when element has been removed on mouseup", function() {
      const $btn = cy.$$("button:first");

      $btn.on("mouseup", function() {
        //# synchronously remove this button
        return $(this).remove();
      });

      $btn.on("click", () => fail("should not have gotten click"));

      return cy.contains("button").click();
    });

    it("silences errors on unfocusable elements", function() {
      const div = cy.$$("div:first");

      return cy.get("div:first").click({force: true});
    });

    it("causes first focused element to receive blur", function() {
      let blurred = false;

      cy.$$("input:first").blur(() => blurred = true);

      return cy
        .get("input:first").focus()
        .get("input:text:last").click()
        .then(() => expect(blurred).to.be.true);
    });

    it("inserts artificial delay of 50ms", function() {
      cy.spy(Promise, "delay");

      return cy.get("#button").click().then(() => expect(Promise.delay).to.be.calledWith(50));
    });

    it("delays 50ms before resolving", function() {
      cy.$$("button:first").on("click", e => {
        return cy.spy(Promise, "delay");
      });

      return cy.get("button:first").click({ multiple: true}).then(() => expect(Promise.delay).to.be.calledWith(50, "click"));
    });

    it("can operate on a jquery collection", function() {
      let clicks = 0;
      const buttons = cy.$$("button").slice(0, 3);
      buttons.click(function() {
        clicks += 1;
        return false;
      });

      //# make sure we have more than 1 button
      expect(buttons.length).to.be.gt(1);

      //# make sure each button received its click event
      return cy.get("button").invoke("slice", 0, 3).click({ multiple: true}).then($buttons => expect($buttons.length).to.eq(clicks));
    });

    it("can cancel multiple clicks", function(done) {
      cy.stub(Cypress.runner, "stop");

      //# abort after the 3rd click
      const stop = _.after(3, () => Cypress.stop());

      const clicked = cy.spy(() => stop());

      const $anchors = cy.$$("#sequential-clicks a");

      $anchors.on("click", clicked);

      //# make sure we have at least 5 anchor links
      expect($anchors.length).to.be.gte(5);

      cy.on("stop", () => {
        //# timeout will get called synchronously
        //# again during a click if the click function
        //# is called
        const timeout = cy.spy(cy.timeout);

        return _.delay(function() {
          //# and we should have stopped clicking after 3
          expect(clicked.callCount).to.eq(3);

          expect(timeout.callCount).to.eq(0);

          return done();
        }
        , 100);
      });

      return cy.get("#sequential-clicks a").click({ multiple: true });
    });

    it("serially clicks a collection", function() {
      let clicks = 0;

      //# create a throttled click function
      //# which proves we are clicking serially
      const throttled = _.throttle(() => clicks += 1
      , 5, {leading: false});

      const anchors = cy.$$("#sequential-clicks a");
      anchors.click(throttled);

      //# make sure we're clicking multiple anchors
      expect(anchors.length).to.be.gt(1);
      return cy.get("#sequential-clicks a").click({ multiple: true}).then($anchors => expect($anchors.length).to.eq(clicks));
    });

    it("increases the timeout delta after each click", function() {
      const count = cy.$$("#three-buttons button").length;

      cy.spy(cy, "timeout");

      return cy.get("#three-buttons button").click({ multiple: true}).then(function() {
        const calls = cy.timeout.getCalls();

        const num = _.filter(calls, call => _.isEqual(call.args, [50, true, "click"]));

        return expect(num.length).to.eq(count);
      });
    });

    //# this test needs to increase the height + width of the div
    //# when we implement scrollBy the delta of the left/top
    it("can click elements which are huge and the center is naturally below the fold", () => cy.get("#massively-long-div").click());

    it("can click a tr", () => cy.get("#table tr:first").click());

    it("places cursor at the end of input", function() {
      cy.get('input:first').invoke('val', 'foobar').click().then(function($el) {
        const el = $el.get(0);
        expect(el.selectionStart).to.eql(6);
        return expect(el.selectionEnd).to.eql(6);
      });
      return cy.get('input:first').invoke('val', '').click().then(function($el) {
        const el = $el.get(0);
        expect(el.selectionStart).to.eql(0);
        return expect(el.selectionEnd).to.eql(0);
      });
    });

    it("places cursor at the end of textarea", function() {
      cy.get('textarea:first').invoke('val', 'foo\nbar\nbaz').click().then(function($el) {
        const el = $el.get(0);
        expect(el.selectionStart).to.eql(11);
        return expect(el.selectionEnd).to.eql(11);
      });

      return cy.get('textarea:first').invoke('val', '').click().then(function($el) {
        const el = $el.get(0);
        expect(el.selectionStart).to.eql(0);
        return expect(el.selectionEnd).to.eql(0);
      });
    });

    it("places cursor at the end of [contenteditable]", function() {

      cy.get('[contenteditable]:first')
      .invoke('html', '<div><br></div>').click()
      .then(function($el) {
        const range = $el.get(0).ownerDocument.getSelection().getRangeAt(0);
        expect(range.startContainer.outerHTML).to.eql('<div><br></div>');
        expect(range.startOffset).to.eql(0);
        expect(range.endContainer.outerHTML).to.eql('<div><br></div>');
        return expect(range.endOffset).to.eql(0);
      });

      cy.get('[contenteditable]:first')
      .invoke('html', 'foo').click()
      .then(function($el) {
        const range = $el.get(0).ownerDocument.getSelection().getRangeAt(0);
        expect(range.startContainer.nodeValue).to.eql('foo');
        expect(range.startOffset).to.eql(3);
        expect(range.endContainer.nodeValue).to.eql('foo');
        return expect(range.endOffset).to.eql(3);
      });

      cy.get('[contenteditable]:first')
      .invoke('html', '<div>foo</div>').click()
      .then(function($el) {
        const range = $el.get(0).ownerDocument.getSelection().getRangeAt(0);
        expect(range.startContainer.nodeValue).to.eql('foo');
        expect(range.startOffset).to.eql(3);
        expect(range.endContainer.nodeValue).to.eql('foo');
        return expect(range.endOffset).to.eql(3);
      });

      return cy.get('[contenteditable]:first')
      .invoke('html', '').click()
      .then(function($el) {
        const el = $el.get(0);
        const range = el.ownerDocument.getSelection().getRangeAt(0);
        expect(range.startContainer).to.eql(el);
        expect(range.startOffset).to.eql(0);
        expect(range.endContainer).to.eql(el);
        return expect(range.endOffset).to.eql(0);
      });
    });

    it("can click SVG elements", function() {
      const onClick = cy.stub();

      const $svgs = cy.$$("#svgs");
      $svgs.click(onClick);

      cy.get("[data-cy=line]").click().first().click();
      cy.get("[data-cy=rect]").click().first().click();
      return cy.get("[data-cy=circle]").click().first().click()
      .then(() => expect(onClick.callCount).to.eq(6));
    });

    it("can click a canvas", function() {
      const onClick = cy.stub();

      const $canvas = cy.$$("#canvas");
      $canvas.click(onClick);

      const ctx = $canvas.get(0).getContext("2d");
      ctx.fillStyle = "green";
      ctx.fillRect(10, 10, 100, 100);

      return cy.get("#canvas").click().then(() => expect(onClick).to.be.calledOnce);
    });

    describe("actionability", function() {

      it('can click on inline elements that wrap lines', () => cy.get('#overflow-link').find('.wrapped').click());

      it("can click elements which are hidden until scrolled within parent container", () => cy.get("#overflow-auto-container").contains("quux").click());

      it("does not scroll when being forced", function() {
        const scrolled = [];

        cy.on("scrolled", ($el, type) => scrolled.push(type));

        return cy
          .get("button:last").click({ force: true })
          .then(() => expect(scrolled).to.be.empty);
      });

      it("does not scroll when position sticky and display flex", function() {
        const scrolled = [];

        cy.on("scrolled", ($el, type) => scrolled.push(type));

        cy.viewport(1000, 660);

        const $body = cy.$$("body");
        $body.css({
          padding: 0,
          margin: 0
        }).children().remove();

        const $wrap = $("<div></div>")
          .attr("id", "flex-wrap")
          .css({
            display: "flex"
          })
          .prependTo($body);

        const $nav = $(`\
<div><input type="text" data-cy="input" />
<br><br>
<a href="#" data-cy="button"> Button </a></div>\
`)
          .attr("id", "nav")
          .css({
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "200px",
            background: "#f0f0f0",
            borderRight: "1px solid silver",
            padding: "20px"
          })
          .appendTo($wrap);

        const $content = $("<div><h1>Hello</h1></div>")
          .attr("id", "content")
          .css({
            padding: "20px",
            flex: 1
          })
          .appendTo($wrap);

        const $longBlock1 = $("<div>Long block 1</div>")
          .attr("id", "long-block-1")
          .css({
            height: "500px",
            border: "1px solid red",
            marginTop: "10px",
            width: "100%"
          }).appendTo($content);

        const $longBlock2 = $("<div>Long block 2</div>")
          .attr("id", "long-block-2")
          .css({
            height: "500px",
            border: "1px solid red",
            marginTop: "10px",
            width: "100%"
          }).appendTo($content);

        const $longBlock3 = $("<div>Long block 3</div>")
          .attr("id", "long-block-3")
          .css({
            height: "500px",
            border: "1px solid red",
            marginTop: "10px",
            width: "100%"
          }).appendTo($content);

        const $longBlock4 = $("<div>Long block 4</div>")
          .attr("id", "long-block-4")
          .css({
            height: "500px",
            border: "1px solid red",
            marginTop: "10px",
            width: "100%"
          }).appendTo($content);

        const $longBlock5 = $("<div>Long block 5</div>")
          .attr("id", "long-block-5")
          .css({
            height: "500px",
            border: "1px solid red",
            marginTop: "10px",
            width: "100%"
          }).appendTo($content);

        //# make scrolling deterministic by ensuring we don't wait for coordsHistory
        //# to build up
        return cy.get('[data-cy=button]').click({ waitForAnimations: false }).then(() => expect(scrolled).to.deep.eq(["element"]));
      });

      it("can force click on hidden elements", () => cy.get("button:first").invoke("hide").click({ force: true }));

      it("can force click on disabled elements", () => cy.get("input:first").invoke("prop", "disabled", true).click({ force: true }));

      it("can forcibly click even when being covered by another element", function() {
        const $btn = $("<button>button covered</button>").attr("id", "button-covered-in-span").prependTo(cy.$$("body"));
        const span = $("<span>span on button</span>").css({position: "absolute", left: $btn.offset().left, top: $btn.offset().top, padding: 5, display: "inline-block", backgroundColor: "yellow"}).prependTo(cy.$$("body"));

        const scrolled = [];
        let retried = false;
        let clicked = false;

        cy.on("scrolled", ($el, type) => scrolled.push(type));

        cy.on("command:retry", ($el, type) => retried = true);

        $btn.on("click", () => clicked = true);

        return cy.get("#button-covered-in-span").click({force: true}).then(function() {
          expect(scrolled).to.be.empty;
          expect(retried).to.be.false;
          return expect(clicked).to.be.true;
        });
      });

      it("eventually clicks when covered up", function() {
        const $btn = $("<button>button covered</button>")
        .attr("id", "button-covered-in-span")
        .prependTo(cy.$$("body"));

        const $span = $("<span>span on button</span>").css({
          position: "absolute",
          left: $btn.offset().left,
          top: $btn.offset().top,
          padding: 5,
          display: "inline-block",
          backgroundColor: "yellow"
        }).prependTo(cy.$$("body"));

        const scrolled = [];
        let retried = false;

        cy.on("scrolled", ($el, type) => scrolled.push(type));

        cy.on("command:retry", _.after(3, function() {
          $span.hide();
          return retried = true;
        })
        );

        return cy.get("#button-covered-in-span").click().then(function() {
          expect(retried).to.be.true;

          //# - element scrollIntoView
          //# - element scrollIntoView (retry animation coords)
          //# - element scrollIntoView (retry covered)
          //# - element scrollIntoView (retry covered)
          //# - window
          return expect(scrolled).to.deep.eq(["element", "element", "element", "element"]);
        });
      });

      it("scrolls the window past a fixed position element when being covered", function() {
        const $btn = $("<button>button covered</button>")
        .attr("id", "button-covered-in-nav")
        .appendTo(cy.$$("#fixed-nav-test"));

        const $nav = $("<nav>nav on button</nav>").css({
          position: "fixed",
          left: 0,
          top: 0,
          padding: 20,
          backgroundColor: "yellow",
          zIndex: 1
        }).prependTo(cy.$$("body"));

        const scrolled = [];

        cy.on("scrolled", ($el, type) => scrolled.push(type));

        return cy.get("#button-covered-in-nav").click().then(() =>
          //# - element scrollIntoView
          //# - element scrollIntoView (retry animation coords)
          //# - window
          expect(scrolled).to.deep.eq(["element", "element", "window"])
        );
      });

      it("scrolls the window past two fixed positioned elements when being covered", function() {
        const $btn = $("<button>button covered</button>")
        .attr("id", "button-covered-in-nav")
        .appendTo(cy.$$("#fixed-nav-test"));

        const $nav = $("<nav>nav on button</nav>").css({
          position: "fixed",
          left: 0,
          top: 0,
          padding: 20,
          backgroundColor: "yellow",
          zIndex: 1
        }).prependTo(cy.$$("body"));

        const $nav2 = $("<nav>nav2 on button</nav>").css({
          position: "fixed",
          left: 0,
          top: 40,
          padding: 20,
          backgroundColor: "red",
          zIndex: 1
        }).prependTo(cy.$$("body"));

        const scrolled = [];

        cy.on("scrolled", ($el, type) => scrolled.push(type));

        return cy.get("#button-covered-in-nav").click().then(() =>
          //# - element scrollIntoView
          //# - element scrollIntoView (retry animation coords)
          //# - window (nav1)
          //# - window (nav2)
          expect(scrolled).to.deep.eq(["element", "element", "window", "window"])
        );
      });

      it("scrolls a container past a fixed position element when being covered", function() {
        cy.viewport(600, 450);

        const $body = cy.$$("body");

        //# we must remove all of our children to
        //# prevent the window from scrolling
        $body.children().remove();

        //# this tests that our container properly scrolls!
        const $container = $("<div></div>")
        .attr("id", "scrollable-container")
        .css({
          position: "relative",
          width: 300,
          height: 200,
          marginBottom: 100,
          backgroundColor: "green",
          overflow: "auto"
        })
        .prependTo($body);

        const $btn = $("<button>button covered</button>")
        .attr("id", "button-covered-in-nav")
        .css({
          marginTop: 500,
          // marginLeft: 500
          marginBottom: 500
        })
        .appendTo($container);

        const $nav = $("<nav>nav on button</nav>")
        .css({
          position: "fixed",
          left: 0,
          top: 0,
          padding: 20,
          backgroundColor: "yellow",
          zIndex: 1
        })
        .prependTo($container);

        const scrolled = [];

        cy.on("scrolled", ($el, type) => scrolled.push(type));

        return cy.get("#button-covered-in-nav").click().then(() =>
          //# - element scrollIntoView
          //# - element scrollIntoView (retry animation coords)
          //# - window
          //# - container
          expect(scrolled).to.deep.eq(["element", "element", "window", "container"])
        );
      });

      it("waits until element becomes visible", function() {
        const $btn = cy.$$("#button").hide();

        let retried = false;

        cy.on("command:retry", _.after(3, function() {
          $btn.show();
          return retried = true;
        })
        );

        return cy.get("#button").click().then(() => expect(retried).to.be.true);
      });

      it("waits until element is no longer disabled", function() {
        const $btn = cy.$$("#button").prop("disabled", true);

        let retried = false;
        let clicks = 0;

        $btn.on("click", () => clicks += 1);

        cy.on("command:retry", _.after(3, function() {
          $btn.prop("disabled", false);
          return retried = true;
        })
        );

        return cy.get("#button").click().then(function() {
          expect(clicks).to.eq(1);
          return expect(retried).to.be.true;
        });
      });

      it("waits until element stops animating", function() {
        let retries = 0;

        cy.on("command:retry", obj => retries += 1);

        cy.stub(cy, "ensureElementIsNotAnimating")
        .throws(new Error("animating!"))
        .onThirdCall().returns();

        return cy.get("button:first").click().then(function() {
          //# - retry animation coords
          //# - retry animation
          //# - retry animation
          expect(retries).to.eq(3);
          return expect(cy.ensureElementIsNotAnimating).to.be.calledThrice;
        });
      });

      it("does not throw when waiting for animations is disabled", function() {
        cy.stub(cy, "ensureElementIsNotAnimating").throws(new Error("animating!"));
        Cypress.config("waitForAnimations", false);

        return cy.get("button:first").click().then(() => expect(cy.ensureElementIsNotAnimating).not.to.be.called);
      });

      it("does not throw when turning off waitForAnimations in options", function() {
        cy.stub(cy, "ensureElementIsNotAnimating").throws(new Error("animating!"));

        return cy.get("button:first").click({waitForAnimations: false}).then(() => expect(cy.ensureElementIsNotAnimating).not.to.be.called);
      });

      it("passes options.animationDistanceThreshold to cy.ensureElementIsNotAnimating", function() {
        const $btn = cy.$$("button:first");

        const { fromWindow } = Cypress.dom.getElementCoordinatesByPosition($btn);

        cy.spy(cy, "ensureElementIsNotAnimating");

        return cy.get("button:first").click({animationDistanceThreshold: 1000}).then(function() {
          const { args } = cy.ensureElementIsNotAnimating.firstCall;

          expect(args[1]).to.deep.eq([fromWindow, fromWindow]);
          return expect(args[2]).to.eq(1000);
        });
      });

      return it("passes config.animationDistanceThreshold to cy.ensureElementIsNotAnimating", function() {
        const animationDistanceThreshold = Cypress.config("animationDistanceThreshold");

        const $btn = cy.$$("button:first");

        const { fromWindow } = Cypress.dom.getElementCoordinatesByPosition($btn);

        cy.spy(cy, "ensureElementIsNotAnimating");

        return cy.get("button:first").click().then(function() {
          const { args } = cy.ensureElementIsNotAnimating.firstCall;

          expect(args[1]).to.deep.eq([fromWindow, fromWindow]);
          return expect(args[2]).to.eq(animationDistanceThreshold);
        });
      });
    });

    describe("assertion verification", function() {
      beforeEach(function() {
        cy.on("log:added", (attrs, log) => {
          if (log.get("name") === "assert") {
            return this.lastLog = log;
          }
        });

        return null;
      });

      it("eventually passes the assertion", function() {
        cy.$$("button:first").click(function() {
          _.delay(() => {
            return $(this).addClass("clicked");
          }
          , 50);
          return false;
        });

        return cy.get("button:first").click().should("have.class", "clicked").then(function() {
          const { lastLog } = this;

          expect(lastLog.get("name")).to.eq("assert");
          expect(lastLog.get("state")).to.eq("passed");
          return expect(lastLog.get("ended")).to.be.true;
        });
      });

      return it("eventually passes the assertion on multiple buttons", function() {
        cy.$$("button").click(function() {
          _.delay(() => {
            return $(this).addClass("clicked");
          }
          , 50);
          return false;
        });

        return cy
          .get("button")
          .invoke("slice", 0, 2)
          .click({ multiple: true })
          .should("have.class", "clicked");
      });
    });

    describe("position argument", function() {
      it("can click center by default", function(done) {
        const $btn = $("<button>button covered</button>").attr("id", "button-covered-in-span").css({height: 100, width: 100}).prependTo(cy.$$("body"));
        const span = $("<span>span</span>").css({position: "absolute", left: $btn.offset().left + 30, top: $btn.offset().top + 40, padding: 5, display: "inline-block", backgroundColor: "yellow"}).appendTo($btn);

        const clicked = _.after(2, () => done());

        span.on("click", clicked);
        $btn.on("click", clicked);

        return cy.get("#button-covered-in-span").click();
      });

      it("can click topLeft", function(done) {
        const $btn = $("<button>button covered</button>").attr("id", "button-covered-in-span").css({height: 100, width: 100}).prependTo(cy.$$("body"));

        const $span = $("<span>span</span>").css({position: "absolute", left: $btn.offset().left, top: $btn.offset().top, padding: 5, display: "inline-block", backgroundColor: "yellow"}).appendTo($btn);

        const clicked = _.after(2, () => done());

        $span.on("click", clicked);
        $btn.on("click", clicked);

        return cy.get("#button-covered-in-span").click("topLeft");
      });

      it("can click top", function(done) {
        const $btn = $("<button>button covered</button>").attr("id", "button-covered-in-span").css({height: 100, width: 100}).prependTo(cy.$$("body"));
        const span = $("<span>span</span>").css({position: "absolute", left: $btn.offset().left + 30, top: $btn.offset().top, padding: 5, display: "inline-block", backgroundColor: "yellow"}).appendTo($btn);

        const clicked = _.after(2, () => done());

        span.on("click", clicked);
        $btn.on("click", clicked);

        return cy.get("#button-covered-in-span").click("top");
      });

      it("can click topRight", function(done) {
        const $btn = $("<button>button covered</button>").attr("id", "button-covered-in-span").css({height: 100, width: 100}).prependTo(cy.$$("body"));
        const span = $("<span>span</span>").css({position: "absolute", left: $btn.offset().left + 80, top: $btn.offset().top, padding: 5, display: "inline-block", backgroundColor: "yellow"}).appendTo($btn);

        const clicked = _.after(2, () => done());

        span.on("click", clicked);
        $btn.on("click", clicked);

        return cy.get("#button-covered-in-span").click("topRight");
      });

      it("can click left", function(done) {
        const $btn = $("<button>button covered</button>").attr("id", "button-covered-in-span").css({height: 100, width: 100}).prependTo(cy.$$("body"));
        const span = $("<span>span</span>").css({position: "absolute", left: $btn.offset().left, top: $btn.offset().top + 40, padding: 5, display: "inline-block", backgroundColor: "yellow"}).appendTo($btn);

        const clicked = _.after(2, () => done());

        span.on("click", clicked);
        $btn.on("click", clicked);

        return cy.get("#button-covered-in-span").click("left");
      });

      it("can click center", function(done) {
        const $btn = $("<button>button covered</button>").attr("id", "button-covered-in-span").css({height: 100, width: 100}).prependTo(cy.$$("body"));
        const span = $("<span>span</span>").css({position: "absolute", left: $btn.offset().left + 30, top: $btn.offset().top + 40, padding: 5, display: "inline-block", backgroundColor: "yellow"}).appendTo($btn);

        const clicked = _.after(2, () => done());

        span.on("click", clicked);
        $btn.on("click", clicked);

        return cy.get("#button-covered-in-span").click("center");
      });

      it("can click right", function(done) {
        const $btn = $("<button>button covered</button>").attr("id", "button-covered-in-span").css({height: 100, width: 100}).prependTo(cy.$$("body"));
        const span = $("<span>span</span>").css({position: "absolute", left: $btn.offset().left + 80, top: $btn.offset().top + 40, padding: 5, display: "inline-block", backgroundColor: "yellow"}).appendTo($btn);

        const clicked = _.after(2, () => done());

        span.on("click", clicked);
        $btn.on("click", clicked);

        return cy.get("#button-covered-in-span").click("right");
      });

      it("can click bottomLeft", function(done) {
        const $btn = $("<button>button covered</button>").attr("id", "button-covered-in-span").css({height: 100, width: 100}).prependTo(cy.$$("body"));
        const span = $("<span>span</span>").css({position: "absolute", left: $btn.offset().left, top: $btn.offset().top + 80, padding: 5, display: "inline-block", backgroundColor: "yellow"}).appendTo($btn);

        const clicked = _.after(2, () => done());

        span.on("click", clicked);
        $btn.on("click", clicked);

        return cy.get("#button-covered-in-span").click("bottomLeft");
      });

      it("can click bottom", function(done) {
        const $btn = $("<button>button covered</button>").attr("id", "button-covered-in-span").css({height: 100, width: 100}).prependTo(cy.$$("body"));
        const span = $("<span>span</span>").css({position: "absolute", left: $btn.offset().left + 30, top: $btn.offset().top + 80, padding: 5, display: "inline-block", backgroundColor: "yellow"}).appendTo($btn);

        const clicked = _.after(2, () => done());

        span.on("click", clicked);
        $btn.on("click", clicked);

        return cy.get("#button-covered-in-span").click("bottom");
      });

      it("can click bottomRight", function(done) {
        const $btn = $("<button>button covered</button>").attr("id", "button-covered-in-span").css({height: 100, width: 100}).prependTo(cy.$$("body"));
        const span = $("<span>span</span>").css({position: "absolute", left: $btn.offset().left + 80, top: $btn.offset().top + 80, padding: 5, display: "inline-block", backgroundColor: "yellow"}).appendTo($btn);

        const clicked = _.after(2, () => done());

        span.on("click", clicked);
        $btn.on("click", clicked);

        return cy.get("#button-covered-in-span").click("bottomRight");
      });

      return it("can pass options along with position", function(done) {
        const $btn = $("<button>button covered</button>").attr("id", "button-covered-in-span").css({height: 100, width: 100}).prependTo(cy.$$("body"));
        const span = $("<span>span</span>").css({position: "absolute", left: $btn.offset().left + 80, top: $btn.offset().top + 80, padding: 5, display: "inline-block", backgroundColor: "yellow"}).appendTo(cy.$$("body"));

        $btn.on("click", () => done());

        return cy.get("#button-covered-in-span").click("bottomRight", {force: true});
      });
    });

    describe("relative coordinate arguments", function() {
      it("can specify x and y", function(done) {
        const $btn = $("<button>button covered</button>")
        .attr("id", "button-covered-in-span")
        .css({height: 100, width: 100})
        .prependTo(cy.$$("body"));

        const $span = $("<span>span</span>")
        .css({position: "absolute", left: $btn.offset().left + 50, top: $btn.offset().top + 65, padding: 5, display: "inline-block", backgroundColor: "yellow"})
        .appendTo($btn);

        const clicked = _.after(2, () => done());

        $span.on("click", clicked);
        $btn.on("click", clicked);

        return cy.get("#button-covered-in-span").click(75, 78);
      });

      return it("can pass options along with x, y", function(done) {
        const $btn = $("<button>button covered</button>").attr("id", "button-covered-in-span").css({height: 100, width: 100}).prependTo(cy.$$("body"));
        const span = $("<span>span</span>").css({position: "absolute", left: $btn.offset().left + 50, top: $btn.offset().top + 65, padding: 5, display: "inline-block", backgroundColor: "yellow"}).appendTo(cy.$$("body"));

        $btn.on("click", () => done());

        return cy.get("#button-covered-in-span").click(75, 78, {force: true});
      });
    });

    describe("mousedown", function() {
      it("gives focus after mousedown", function(done) {
        const input = cy.$$("input:first");

        input.get(0).addEventListener("focus", e => {
          const obj = _.pick(e, "bubbles", "cancelable", "view", "which", "relatedTarget", "detail", "type");
          expect(obj).to.deep.eq({
            bubbles: false,
            cancelable: false,
            view: cy.state("window"),
            //# chrome no longer fires pageX and pageY
            // pageX: 0
            // pageY: 0
            which: 0,
            relatedTarget: null,
            detail: 0,
            type: "focus"
          });
          return done();
        });

        return cy.get("input:first").click();
      });

      it("gives focusin after mousedown", function(done) {
        const input = cy.$$("input:first");

        input.get(0).addEventListener("focusin", e => {
          const obj = _.pick(e, "bubbles", "cancelable", "view", "which", "relatedTarget", "detail", "type");
          expect(obj).to.deep.eq({
            bubbles: true,
            cancelable: false,
            view: cy.state("window"),
            // pageX: 0
            // pageY: 0
            which: 0,
            relatedTarget: null,
            detail: 0,
            type: "focusin"
          });
          return done();
        });

        return cy.get("input:first").click();
      });

      it("gives all events in order", function() {
        const events = [];

        const input = cy.$$("input:first");

        _.each("focus focusin mousedown mouseup click".split(" "), event =>
          input.get(0).addEventListener(event, () => events.push(event))
        );

        return cy.get("input:first").click().then(() => expect(events).to.deep.eq(["mousedown", "focus", "focusin", "mouseup", "click"]));
    });

      it("does not give focus if mousedown is defaultPrevented", function(done) {
        const input = cy.$$("input:first");

        input.get(0).addEventListener("focus", e => done("should not have recieved focused event"));

        input.get(0).addEventListener("mousedown", function(e) {
          e.preventDefault();
          return expect(e.defaultPrevented).to.be.true;
        });

        return cy.get("input:first").click().then(() => done());
      });

      it("still gives focus to the focusable element even when click is issued to child element", function() {
        const $btn = $("<button>", {id: "button-covered-in-span"}).prependTo(cy.$$("body"));
        const span = $("<span>span in button</span>").css({padding: 5, display: "inline-block", backgroundColor: "yellow"}).appendTo($btn);

        return cy
          .get("#button-covered-in-span").click()
          .focused().should("have.id", "button-covered-in-span");
      });

      return it("will not fire focus events when nothing can receive focus", function() {
        const onFocus = cy.stub();

        const win = cy.state("window");
        const $body = cy.$$("body");
        const $div = cy.$$("#nested-find");

        $(win).on("focus", onFocus);
        $body.on("focus", onFocus);
        $div.on("focus", onFocus);

        return cy
        .get("#nested-find").click()
        .then(() => expect(onFocus).not.to.be.called);
      });
    });

      // it "events", ->
      //   $btn = cy.$$("button")
      //   win = $(cy.state("window"))

      //   _.each {"btn": btn, "win": win}, (type, key) ->
      //     _.each "focus mousedown mouseup click".split(" "), (event) ->
      //     # _.each "focus focusin focusout mousedown mouseup click".split(" "), (event) ->
      //       type.get(0).addEventListener event, (e) ->
      //         if key is "btn"
      //           # e.preventDefault()
      //           e.stopPropagation()

      //         console.log "#{key} #{event}", e

        // $btn.on "mousedown", (e) ->
          // console.log("btn mousedown")
          // e.preventDefault()

        // win.on "mousedown", -> console.log("win mousedown")

    describe("errors", function() {
      beforeEach(function() {
        Cypress.config("defaultCommandTimeout", 100);

        this.logs = [];

        cy.on("log:added", (attrs, log) => {
          this.lastLog = log;
          return this.logs.push(log);
        });

        return null;
      });

      it("throws when not a dom subject", function(done) {
        cy.on("fail", () => done());

        return cy.click();
      });

      it("throws when attempting to click multiple elements", function(done) {
        const num = cy.$$("button").length;

        cy.on("fail", function(err) {
          expect(err.message).to.eq("cy.click() can only be called on a single element. Your subject contained 15 elements. Pass { multiple: true } if you want to serially click each element.");
          return done();
        });

        return cy.get("button").click();
      });

      it("throws when subject is not in the document", function(done) {
        let clicked = 0;

        var $checkbox = cy.$$(":checkbox:first").click(function(e) {
          clicked += 1;
          $checkbox.remove();
          return false;
        });

        cy.on("fail", function(err) {
          expect(clicked).to.eq(1);
          expect(err.message).to.include("cy.click() failed because this element");
          return done();
        });

        return cy.get(":checkbox:first").click().click();
      });

      it("logs once when not dom subject", function(done) {
        cy.on("fail", err => {
          const { lastLog } = this;

          expect(this.logs.length).to.eq(1);
          expect(lastLog.get("error")).to.eq(err);
          return done();
        });

        return cy.click();
      });

      it("throws when any member of the subject isnt visible", function(done) {
        cy.timeout(250);

        const $btn = cy.$$("#three-buttons button").show().last().hide();

        cy.on("fail", err => {
          const { lastLog } = this;

          expect(this.logs.length).to.eq(4);
          expect(lastLog.get("error")).to.eq(err);
          expect(err.message).to.include("cy.click() failed because this element is not visible");
          return done();
        });

        return cy.get("#three-buttons button").click({ multiple: true });
      });

      it("throws when subject is disabled", function(done) {
        const $btn = cy.$$("#button").prop("disabled", true);

        cy.on("fail", err => {
          //# get + click logs
          expect(this.logs.length).eq(2);
          expect(err.message).to.include("cy.click() failed because this element is disabled:\n");
          return done();
        });

        return cy.get("#button").click();
      });

      it("throws when a non-descendent element is covering subject", function(done) {
        const $btn = $("<button>button covered</button>").attr("id", "button-covered-in-span").prependTo(cy.$$("body"));
        const span = $("<span>span on button</span>").css({position: "absolute", left: $btn.offset().left, top: $btn.offset().top, padding: 5, display: "inline-block", backgroundColor: "yellow"}).prependTo(cy.$$("body"));

        cy.on("fail", err => {
          const { lastLog } = this;

          //# get + click logs
          expect(this.logs.length).eq(2);
          expect(lastLog.get("error")).to.eq(err);

          //# there should still be 2 snapshots on error (before + after)
          expect(lastLog.get("snapshots").length).to.eq(2);
          expect(lastLog.get("snapshots")[0]).to.be.an("object");
          expect(lastLog.get("snapshots")[0].name).to.eq("before");
          expect(lastLog.get("snapshots")[1]).to.be.an("object");
          expect(lastLog.get("snapshots")[1].name).to.eq("after");
          expect(err.message).to.include("cy.click() failed because this element");
          expect(err.message).to.include("is being covered by another element");

          const clickLog = this.logs[1];
          expect(clickLog.get("name")).to.eq("click");

          const console = clickLog.invoke("consoleProps");
          expect(console["Tried to Click"]).to.eq($btn.get(0));
          expect(console["But its Covered By"]).to.eq(span.get(0));

          return done();
        });

        return cy.get("#button-covered-in-span").click();
      });

      it("throws when non-descendent element is covering with fixed position", function(done) {
        const $btn = $("<button>button covered</button>").attr("id", "button-covered-in-span").prependTo(cy.$$("body"));
        const span = $("<span>span on button</span>").css({position: "fixed", left: 0, top: 0, padding: 20, display: "inline-block", backgroundColor: "yellow"}).prependTo(cy.$$("body"));

        cy.on("fail", err => {
          const { lastLog } = this;

          //# get + click logs
          expect(this.logs.length).eq(2);
          expect(lastLog.get("error")).to.eq(err);

          //# there should still be 2 snapshots on error (before + after)
          expect(lastLog.get("snapshots").length).to.eq(2);
          expect(lastLog.get("snapshots")[0]).to.be.an("object");
          expect(lastLog.get("snapshots")[0].name).to.eq("before");
          expect(lastLog.get("snapshots")[1]).to.be.an("object");
          expect(lastLog.get("snapshots")[1].name).to.eq("after");
          expect(err.message).to.include("cy.click() failed because this element");
          expect(err.message).to.include("is being covered by another element");

          const console = lastLog.invoke("consoleProps");
          expect(console["Tried to Click"]).to.eq($btn.get(0));
          expect(console["But its Covered By"]).to.eq(span.get(0));

          return done();
        });

        return cy.get("#button-covered-in-span").click();
      });

      it("throws when element is fixed position and being covered", function(done) {
        const $btn = $("<button>button covered</button>")
        .attr("id", "button-covered-in-span")
        .css({position: "fixed", left: 0, top: 0})
        .prependTo(cy.$$("body"));

        const $span = $("<span>span on button</span>")
        .css({position: "fixed", left: 0, top: 0, padding: 20, display: "inline-block", backgroundColor: "yellow", zIndex: 10})
        .prependTo(cy.$$("body"));

        cy.on("fail", err => {
          const { lastLog } = this;

          //# get + click logs
          expect(this.logs.length).eq(2);
          expect(lastLog.get("error")).to.eq(err);

          //# there should still be 2 snapshots on error (before + after)
          expect(lastLog.get("snapshots").length).to.eq(2);
          expect(lastLog.get("snapshots")[0]).to.be.an("object");
          expect(lastLog.get("snapshots")[0].name).to.eq("before");
          expect(lastLog.get("snapshots")[1]).to.be.an("object");
          expect(lastLog.get("snapshots")[1].name).to.eq("after");
          expect(err.message).to.include("cy.click() failed because this element is not visible:");
          expect(err.message).to.include(">button ...</button>");
          expect(err.message).to.include("'<button#button-covered-in-span>' is not visible because it has CSS property: 'position: fixed' and its being covered");
          expect(err.message).to.include(">span on...</span>");

          const console = lastLog.invoke("consoleProps");
          expect(console["Tried to Click"]).to.be.undefined;
          expect(console["But its Covered By"]).to.be.undefined;

          return done();
        });

        return cy.get("#button-covered-in-span").click();
      });

      it("throws when element is hidden and theres no element specifically covering it", function(done) {
        //# i cant come up with a way to easily make getElementAtCoordinates
        //# return null so we are just forcing it to return null to simulate
        //# the element being "hidden" so to speak but still displacing space

        cy.stub(Cypress.dom, "getElementAtPointFromViewport").returns(null);

        cy.on("fail", function(err) {
          expect(err.message).to.include("cy.click() failed because the center of this element is hidden from view:");
          expect(err.message).to.include("<li>quux</li>");
          return done();
        });

        return cy.get("#overflow-auto-container").contains("quux").click();
      });

      it("throws when attempting to click a <select> element", function(done) {
        cy.on("fail", err => {
          expect(this.logs.length).to.eq(2);
          expect(err.message).to.eq("cy.click() cannot be called on a <select> element. Use cy.select() command instead to change the value.");
          return done();
        });

        return cy.get("select:first").click();
      });

      it("throws when provided invalid position", function(done) {
        cy.on("fail", err => {
          expect(this.logs.length).to.eq(2);
          expect(err.message).to.eq("Invalid position argument: 'foo'. Position may only be topLeft, top, topRight, left, center, right, bottomLeft, bottom, bottomRight.");
          return done();
        });

        return cy.get("button:first").click("foo");
      });

      it("throws when element animation exceeds timeout", function(done) {
        //# force the animation calculation to think we moving at a huge distance ;-)
        cy.stub(Cypress.utils, "getDistanceBetween").returns(100000);

        let clicks = 0;

        cy.$$("button:first").on("click", () => clicks += 1);

        cy.on("fail", function(err) {
          expect(clicks).to.eq(0);
          expect(err.message).to.include("cy.click() could not be issued because this element is currently animating:\n");
          return done();
        });

        return cy.get("button:first").click();
      });

      it("eventually fails the assertion", function(done) {
        cy.on("fail", err => {
          const { lastLog } = this;

          expect(err.message).to.include(lastLog.get("error").message);
          expect(err.message).not.to.include("undefined");
          expect(lastLog.get("name")).to.eq("assert");
          expect(lastLog.get("state")).to.eq("failed");
          expect(lastLog.get("error")).to.be.an.instanceof(chai.AssertionError);

          return done();
        });

        return cy.get("button:first").click().should("have.class", "clicked");
      });

      return it("does not log an additional log on failure", function(done) {
        cy.on("fail", () => {
          expect(this.logs.length).to.eq(3);
          return done();
        });

        return cy.get("button:first").click().should("have.class", "clicked");
      });
    });

    return describe(".log", function() {
      beforeEach(function() {
        this.logs = [];

        cy.on("log:added", (attrs, log) => {
          this.lastLog = log;
          return this.logs.push(log);
        });

        return null;
      });

      it("logs immediately before resolving", function(done) {
        const button = cy.$$("button:first");

        cy.on("log:added", function(attrs, log) {
          if (log.get("name") === "click") {
            expect(log.get("state")).to.eq("pending");
            expect(log.get("$el").get(0)).to.eq(button.get(0));
            return done();
          }
        });

        return cy.get("button:first").click();
      });

      it("snapshots before clicking", function(done) {
        cy.$$("button:first").click(() => {
          const { lastLog } = this;

          expect(lastLog.get("snapshots").length).to.eq(1);
          expect(lastLog.get("snapshots")[0].name).to.eq("before");
          expect(lastLog.get("snapshots")[0].body).to.be.an("object");
          return done();
        });

        return cy.get("button:first").click();
      });

      it("snapshots after clicking", () =>
        cy.get("button:first").click().then(function($button) {
          const { lastLog } = this;

          expect(lastLog.get("snapshots").length).to.eq(2);
          expect(lastLog.get("snapshots")[1].name).to.eq("after");
          return expect(lastLog.get("snapshots")[1].body).to.be.an("object");
        })
      );

      it("returns only the $el for the element of the subject that was clicked", function() {
        const clicks = [];

        //# append two buttons
        const button = () => $("<button class='clicks'>click</button>");
        cy.$$("body").append(button()).append(button());

        cy.on("log:added", function(attrs, log) {
          if (log.get("name") === "click") {
            return clicks.push(log);
          }
        });

        return cy.get("button.clicks").click({ multiple: true}).then(function($buttons) {
          expect($buttons.length).to.eq(2);
          expect(clicks.length).to.eq(2);
          return expect(clicks[1].get("$el").get(0)).to.eq($buttons.last().get(0));
        });
      });

      it("logs only 1 click event", function() {
        const logs = [];

        cy.on("log:added", function(attrs, log) {
          if (log.get("name") === "click") {
            return logs.push(log);
          }
        });

        return cy.get("button:first").click().then(() => expect(logs.length).to.eq(1));
      });

      it("passes in coords", () =>
        cy.get("button").first().click().then(function($btn) {
          const { lastLog } = this;

          $btn.blur(); //# blur which removes focus styles which would change coords
          const { fromWindow } = Cypress.dom.getElementCoordinatesByPosition($btn);
          return expect(lastLog.get("coords")).to.deep.eq(fromWindow);
        })
      );

      it("ends", function() {
        const logs = [];

        cy.on("log:added", function(attrs, log) {
          if (log.get("name") === "click") {
            return logs.push(log);
          }
        });

        return cy.get("#three-buttons button").click({ multiple: true}).then(() =>
          _.each(logs, function(log) {
            expect(log.get("state")).to.eq("passed");
            return expect(log.get("ended")).to.be.true;
          })
        );
      });

      it("logs { multiple: true} options",  () =>
        cy.get("span").invoke("slice", 0, 2).click({multiple: true, timeout: 1000}).then(function() {
          const { lastLog } = this;

          expect(lastLog.get("message")).to.eq("{multiple: true, timeout: 1000}");
          return expect(lastLog.invoke("consoleProps").Options).to.deep.eq({multiple: true, timeout: 1000});})
    );

      it("#consoleProps", () =>
        cy.get("button").first().click().then(function($button) {
          const { lastLog } = this;

          const console   = lastLog.invoke("consoleProps");
          const { fromWindow } = Cypress.dom.getElementCoordinatesByPosition($button);
          const logCoords = lastLog.get("coords");
          expect(logCoords.x).to.be.closeTo(fromWindow.x, 1); //# ensure we are within 1
          expect(logCoords.y).to.be.closeTo(fromWindow.y, 1); //# ensure we are within 1
          expect(console.Command).to.eq("click");
          expect(console["Applied To"]).to.eq(lastLog.get("$el").get(0));
          expect(console.Elements).to.eq(1);
          expect(console.Coords.x).to.be.closeTo(fromWindow.x, 1); //# ensure we are within 1
          return expect(console.Coords.y).to.be.closeTo(fromWindow.y, 1);
        })
      ); //# ensure we are within 1

      it("#consoleProps actual element clicked", function() {
        const $btn = $("<button>", {
          id: "button-covered-in-span"
        })
        .prependTo(cy.$$("body"));

        const $span = $("<span>span in button</span>")
        .css({ padding: 5, display: "inline-block", backgroundColor: "yellow" })
        .appendTo($btn);

        return cy.get("#button-covered-in-span").click().then(function() {
          return expect(this.lastLog.invoke("consoleProps")["Actual Element Clicked"]).to.eq($span.get(0));
        });
      });

      it("#consoleProps groups MouseDown", function() {
        cy.$$("input:first").mousedown(() => false);

        return cy.get("input:first").click().then(function() {
          return expect(this.lastLog.invoke("consoleProps").groups()).to.deep.eq([
            {
              name: "MouseDown",
              items: {
                preventedDefault: true,
                stoppedPropagation: true
              }
            },
            {
              name: "MouseUp",
              items: {
                preventedDefault: false,
                stoppedPropagation: false
              }
            },
            {
              name: "Click",
              items: {
                preventedDefault: false,
                stoppedPropagation: false
              }
            }
          ]);});
    });

      it("#consoleProps groups MouseUp", function() {
        cy.$$("input:first").mouseup(() => false);

        return cy.get("input:first").click().then(function() {
          return expect(this.lastLog.invoke("consoleProps").groups()).to.deep.eq([
            {
              name: "MouseDown",
              items: {
                preventedDefault: false,
                stoppedPropagation: false
              }
            },
            {
              name: "MouseUp",
              items: {
                preventedDefault: true,
                stoppedPropagation: true
              }
            },
            {
              name: "Click",
              items: {
                preventedDefault: false,
                stoppedPropagation: false
              }
            }
          ]);});
    });

      it("#consoleProps groups Click", function() {
        cy.$$("input:first").click(() => false);

        return cy.get("input:first").click().then(function() {
          return expect(this.lastLog.invoke("consoleProps").groups()).to.deep.eq([
            {
              name: "MouseDown",
              items: {
                preventedDefault: false,
                stoppedPropagation: false
              }
            },
            {
              name: "MouseUp",
              items: {
                preventedDefault: false,
                stoppedPropagation: false
              }
            },
            {
              name: "Click",
              items: {
                preventedDefault: true,
                stoppedPropagation: true
              }
            }
          ]);});
    });

      it("#consoleProps groups have activated modifiers", function() {
        cy.$$("input:first").click(() => false);

        return cy.get("input:first").type("{ctrl}{shift}", {release: false}).click().then(function() {
          expect(this.lastLog.invoke("consoleProps").groups()).to.deep.eq([
            {
              name: "MouseDown",
              items: {
                preventedDefault: false,
                stoppedPropagation: false,
                modifiers: "ctrl, shift"
              }
            },
            {
              name: "MouseUp",
              items: {
                preventedDefault: false,
                stoppedPropagation: false,
                modifiers: "ctrl, shift"
              }
            },
            {
              name: "Click",
              items: {
                preventedDefault: true,
                stoppedPropagation: true,
                modifiers: "ctrl, shift"
              }
            }
          ]);
          return cy.get("body").type("{ctrl}");
        });
      }); //# clear modifiers

      it("#consoleProps when no mouseup or click", function() {
        const $btn = cy.$$("button:first");

        $btn.on("mousedown", function() {
          //# synchronously remove this button
          return $(this).remove();
        });

        return cy.contains("button").click().then(function() {
          return expect(this.lastLog.invoke("consoleProps").groups()).to.deep.eq([
            {
              name: "MouseDown",
              items: {
                preventedDefault: false,
                stoppedPropagation: false
              }
            }
          ]);});
    });

      it("#consoleProps when no click", function() {
        const $btn = cy.$$("button:first");

        $btn.on("mouseup", function() {
          //# synchronously remove this button
          return $(this).remove();
        });

        return cy.contains("button").click().then(function() {
          return expect(this.lastLog.invoke("consoleProps").groups()).to.deep.eq([
            {
              name: "MouseDown",
              items: {
                preventedDefault: false,
                stoppedPropagation: false
              }
            },
            {
              name: "MouseUp",
              items: {
                preventedDefault: false,
                stoppedPropagation: false
              }
            }
          ]);});
    });

      it("does not fire a click when element has been removed on mouseup", function() {
        const $btn = cy.$$("button:first");

        $btn.on("mouseup", function() {
          //# synchronously remove this button
          return $(this).remove();
        });

        $btn.on("click", () => fail("should not have gotten click"));

        return cy.contains("button").click();
      });

      return it("logs deltaOptions", () =>
        cy
          .get("button:first").click({force: true, timeout: 1000})
          .then(function() {
            const { lastLog } = this;

            expect(lastLog.get("message")).to.eq("{force: true, timeout: 1000}");
            return expect(lastLog.invoke("consoleProps").Options).to.deep.eq({force: true, timeout: 1000});})
    );
  });
});

  return context("#dblclick", function() {
    it("sends a dblclick event", function(done) {
      cy.$$("#button").dblclick(e => done());

      return cy.get("#button").dblclick();
    });

    it("returns the original subject", function() {
      const $btn = cy.$$("#button");

      return cy.get("#button").dblclick().then($button => expect($button).to.match($btn));
    });

    it("causes focusable elements to receive focus", function(done) {
      const $text = cy.$$(":text:first");

      $text.focus(() => done());

      return cy.get(":text:first").dblclick();
    });

    it("silences errors on unfocusable elements", () => cy.get("div:first").dblclick());

    it("causes first focused element to receive blur", function() {
      let blurred = false;

      cy.$$("input:first").blur(() => blurred = true);

      return cy
        .get("input:first").focus()
        .get("input:text:last").dblclick()
        .then(() => expect(blurred).to.be.true);
    });

    it("inserts artificial delay of 50ms", function() {
      cy.spy(Promise, "delay");

      return cy.get("#button").click().then(() => expect(Promise.delay).to.be.calledWith(50));
    });

    it("can operate on a jquery collection", function() {
      let dblclicks = 0;

      const $buttons = cy.$$("button").slice(0, 2);
      $buttons.dblclick(function() {
        dblclicks += 1;
        return false;
      });

      //# make sure we have more than 1 button
      expect($buttons.length).to.be.gt(1);

      //# make sure each button received its dblclick event
      return cy.get("button").invoke("slice", 0, 2).dblclick().then($buttons => expect($buttons.length).to.eq(dblclicks));
    });

    //# TODO: fix this once we implement aborting / restoring / reset
    it.skip("can cancel multiple dblclicks", function(done) {
      let dblclicks = 0;

      const spy = this.sandbox.spy(() => {
        return this.Cypress.abort();
      });

      //# abort after the 3rd dblclick
      const dblclicked = _.after(3, spy);

      const anchors = cy.$$("#sequential-clicks a");
      anchors.dblclick(function() {
        dblclicks += 1;
        return dblclicked();
      });

      //# make sure we have at least 5 anchor links
      expect(anchors.length).to.be.gte(5);

      cy.on("cancel", () => {
        //# timeout will get called synchronously
        //# again during a click if the click function
        //# is called
        const timeout = this.sandbox.spy(cy, "_timeout");

        return _.delay(function() {
          //# abort should only have been called once
          expect(spy.callCount).to.eq(1);

          //# and we should have stopped dblclicking after 3
          expect(dblclicks).to.eq(3);

          expect(timeout.callCount).to.eq(0);

          return done();
        }
        , 200);
      });

      return cy.get("#sequential-clicks a").dblclick();
    });

    it("serially dblclicks a collection", function() {
      let dblclicks = 0;

      //# create a throttled dblclick function
      //# which proves we are dblclicking serially
      const throttled = _.throttle(() => dblclicks += 1
      , 5, {leading: false});

      const anchors = cy.$$("#sequential-clicks a");
      anchors.dblclick(throttled);

      //# make sure we're dblclicking multiple anchors
      expect(anchors.length).to.be.gt(1);
      return cy.get("#sequential-clicks a").dblclick().then($anchors => expect($anchors.length).to.eq(dblclicks));
    });

    it("increases the timeout delta after each dblclick", function() {
      const count = cy.$$("#three-buttons button").length;

      cy.spy(cy, "timeout");

      return cy.get("#three-buttons button").dblclick().then(function() {
        const calls = cy.timeout.getCalls();

        const num = _.filter(calls, call => _.isEqual(call.args, [50, true, "dblclick"]));

        return expect(num.length).to.eq(count);
      });
    });

    describe("errors", function() {
      beforeEach(function() {
        Cypress.config("defaultCommandTimeout", 100);

        this.logs = [];

        cy.on("log:added", (attrs, log) => {
          this.lastLog = log;
          return this.logs.push(log);
        });

        return null;
      });

      it("throws when not a dom subject", function(done) {
        cy.on("fail", () => done());

        return cy.dblclick();
      });

      it("throws when subject is not in the document", function(done) {
        let dblclicked = 0;

        var $button = cy.$$("button:first").dblclick(function(e) {
          dblclicked += 1;
          $button.remove();
          return false;
        });

        cy.on("fail", function(err) {
          expect(dblclicked).to.eq(1);
          expect(err.message).to.include("cy.dblclick() failed because this element");
          return done();
        });

        return cy.get("button:first").dblclick().dblclick();
      });

      it("throws when any member of the subject isnt visible", function(done) {
        const $btn = cy.$$("button").slice(0, 3).show().last().hide();

        cy.on("fail", function(err) {
          expect(err.message).to.include("cy.dblclick() failed because this element is not visible");
          return done();
        });

        return cy.get("button").invoke("slice", 0, 3).dblclick();
      });

      it("logs once when not dom subject", function(done) {
        cy.on("fail", err => {
          const { lastLog } = this;

          expect(this.logs.length).to.eq(1);
          expect(lastLog.get("error")).to.eq(err);
          return done();
        });

        return cy.dblclick();
      });

      return it("throws when any member of the subject isnt visible", function(done) {
        const $btn = cy.$$("#three-buttons button").show().last().hide();

        cy.on("fail", err => {
          const { lastLog } = this;

          expect(this.logs.length).to.eq(4);
          expect(lastLog.get("error")).to.eq(err);
          expect(err.message).to.include("cy.dblclick() failed because this element is not visible");
          return done();
        });

        return cy.get("#three-buttons button").dblclick();
      });
    });

    return describe(".log", function() {
      beforeEach(function() {
        this.logs = [];

        cy.on("log:added", (attrs, log) => {
          this.lastLog = log;
          return this.logs.push(log);
        });

        return null;
      });

      it("logs immediately before resolving", function(done) {
        const $button = cy.$$("button:first");

        cy.on("log:added", function(attrs, log) {
          if (log.get("name") === "dblclick") {
            expect(log.get("state")).to.eq("pending");
            expect(log.get("$el").get(0)).to.eq($button.get(0));
            return done();
          }
        });

        return cy.get("button:first").dblclick();
      });

      it("snapshots after clicking", () =>
        cy.get("button:first").dblclick().then(function($button) {
          const { lastLog } = this;

          expect(lastLog.get("snapshots").length).to.eq(1);
          return expect(lastLog.get("snapshots")[0]).to.be.an("object");
        })
      );

      it("returns only the $el for the element of the subject that was dblclicked", function() {
        const dblclicks = [];

        //# append two buttons
        const $button = () => $("<button class='dblclicks'>dblclick</button");
        cy.$$("body").append($button()).append($button());

        cy.on("log:added", function(attrs, log) {
          if (log.get("name") === "dblclick") {
            return dblclicks.push(log);
          }
        });

        return cy.get("button.dblclicks").dblclick().then(function($buttons) {
          expect($buttons.length).to.eq(2);
          expect(dblclicks.length).to.eq(2);
          return expect(dblclicks[1].get("$el").get(0)).to.eq($buttons.last().get(0));
        });
      });

      it("logs only 1 dblclick event", function() {
        const logs = [];

        cy.on("log:added", function(attrs, log) {
          if (log.get("name") === "dblclick") {
            return logs.push(log);
          }
        });

        return cy.get("button:first").dblclick().then(() => expect(logs.length).to.eq(1));
      });

      return it("#consoleProps", function() {
        cy.on("log:added", (attrs, log) => {
          this.log = log;
          
      });

        return cy.get("button").first().dblclick().then(function($button) {
          const { lastLog } = this;

          return expect(lastLog.invoke("consoleProps")).to.deep.eq({
            Command: "dblclick",
            "Applied To": lastLog.get("$el").get(0),
            Elements: 1
          });});
    });
  });
});
});
