(function() {
  var AtmosDn, AtmosUp, Canvas, Chart, Checkbox, Display, Earth, Emitter, Globe, InfraredAtmos, InfraredEarth, Photon, Shell, Simulation, Slider, Sun, Sunlight, Vector, char, d3Object, pi, sim,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Number.prototype.pow = function(p) {
    return Math.pow(this, p);
  };

  pi = Math.PI;

  char = function(id, code) {
    return $("." + id).html("&" + code + ";");
  };

  char("deg", "deg");

  char("percent", "#37");

  char("equals", "#61");

  d3Object = (function() {
    function d3Object(id1) {
      this.id = id1;
      this.element = d3.select("#" + this.id);
      this.element.selectAll("svg").remove();
      this.obj = this.element.append("svg");
      this.initAxes();
    }

    d3Object.prototype.append = function(obj) {
      return this.obj.append(obj);
    };

    d3Object.prototype.initAxes = function() {};

    return d3Object;

  })();

  Display = (function() {
    function Display() {
      this.element = document.getElementById("temperature");
    }

    Display.prototype.val = function(val) {
      return this.element.textContent = val.toFixed(1);
    };

    return Display;

  })();

  Globe = (function(superClass) {
    var color, height, width;

    extend(Globe, superClass);

    width = 310;

    height = 310;

    color = "#39f";

    function Globe() {
      Globe.__super__.constructor.call(this, "globe");
      this.obj.attr("width", width);
      this.obj.attr("height", height);
      this.projection = d3.geo.orthographic().scale(100).translate([width / 2, height / 2]).rotate(0).clipAngle(90);
      this.path = d3.geo.path().projection(this.projection);
      this.obj.append("path").datum({
        type: "Sphere"
      }).attr("d", this.path).attr("stroke", color);
      this.graticule = d3.geo.graticule();
      this.obj.append("path").datum(this.graticule).attr("d", this.path).attr("stroke", color);
    }

    return Globe;

  })(d3Object);

  Shell = (function(superClass) {
    var height, width;

    extend(Shell, superClass);

    width = 310;

    height = 310;

    function Shell() {
      var shellArea;
      Shell.__super__.constructor.call(this, "shells");
      this.data = [0, 0];
      this.obj.attr("width", width);
      this.obj.attr("height", height);
      shellArea = this.obj.append("g");
      shellArea.attr("width", width);
      shellArea.attr("height", height);
      shellArea.attr("id", "shellArea");
      this.circles = shellArea.selectAll("circle").data([100, 150]).enter().append("circle").attr("cx", width / 2).attr("cy", height / 2).attr("fill", "transparent").attr("stroke-width", "10").attr("opacity", "0.75").attr("r", function(d) {
        return d;
      });
      this.val(this.data);
    }

    Shell.prototype.initAxes = function() {
      return this.c = d3.scale.linear().domain([0, 500]).range(["black", "orangered"]);
    };

    Shell.prototype.val = function(val) {
      this.data = val;
      this.circles.data(this.data);
      return this.circles.attr("stroke", (function(_this) {
        return function(d) {
          if (d > 0) {
            return _this.c(d);
          } else {
            return "transparent";
          }
        };
      })(this));
    };

    return Shell;

  })(d3Object);

  Chart = (function(superClass) {
    var barWidth, colors, height, margin, width;

    extend(Chart, superClass);

    barWidth = 45;

    margin = {
      top: 50,
      right: 10,
      bottom: 50,
      left: 10
    };

    width = 210 - margin.left - margin.right;

    height = 300 - margin.top - margin.bottom;

    colors = ["yellow", "red"];

    function Chart() {
      this.val = bind(this.val, this);
      var chartArea;
      Chart.__super__.constructor.call(this, "chart");
      chartArea = this.obj;
      this.data = [0, 0];
      chartArea.attr("width", width + margin.left + margin.right);
      chartArea.attr("height", height + margin.top + margin.bottom);
      chartArea.attr("class", "chart");
      chartArea.attr("id", "chartArea");
      this.plotArea = chartArea.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("id", "plotArea");
      this.bars = this.plotArea.selectAll("rect").data([1, 2]).enter().append("rect").attr("width", barWidth).attr("x", (function(_this) {
        return function(d, i) {
          return i * barWidth;
        };
      })(this)).attr("style", function(d, i) {
        return "fill:" + colors[i];
      });
      this.val(this.data);
      chartArea.append("g").attr("transform", "translate(" + (2 * barWidth + 20) + "," + margin.top + ")").call(this.yAxis);
    }

    Chart.prototype.initAxes = function() {
      this.y = d3.scale.linear().domain([0, 400]).range([height, 0]);
      return this.yAxis = d3.svg.axis().scale(this.y).orient("right");
    };

    Chart.prototype.val = function(val) {
      this.data = val;
      this.bars.data(this.data);
      return this.bars.attr("y", (function(_this) {
        return function(d) {
          return _this.y(d);
        };
      })(this)).attr("height", (function(_this) {
        return function(d) {
          return height - _this.y(d);
        };
      })(this));
    };

    return Chart;

  })(d3Object);

  Canvas = (function() {
    function Canvas() {}

    Canvas.width = 960;

    Canvas.height = 480;

    Canvas.canvas = document.querySelector('canvas');

    Canvas.canvas.width = Canvas.width;

    Canvas.canvas.height = Canvas.height;

    Canvas.ctx = Canvas.canvas.getContext('2d');

    Canvas.clear = function() {
      return this.ctx.clearRect(0, 0, this.width, this.height);
    };

    Canvas.square = function(pos, size, color) {
      this.ctx.fillStyle = color;
      return this.ctx.fillRect(pos.x, pos.y, size, size);
    };

    return Canvas;

  })();

  Vector = (function() {
    var z;

    z = function() {
      return new Vector;
    };

    function Vector(x, y1) {
      this.x = x != null ? x : 0;
      this.y = y1 != null ? y1 : 0;
    }

    Vector.prototype.add = function(v) {
      if (v == null) {
        v = z();
      }
      this.x += v.x;
      this.y += v.y;
      return this;
    };

    Vector.prototype.mag = function() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    Vector.prototype.ang = function() {
      return Math.atan2(this.y, this.x);
    };

    Vector.prototype.polar = function(m, a) {
      this.x = m * Math.cos(a);
      this.y = m * Math.sin(a);
      return this;
    };

    return Vector;

  })();

  Photon = (function() {
    Photon.prototype.colors = ["#ff0", "#ff0", "#ff0", "#ff0"];

    Photon.prototype.sizes = [2, 4, 4, 4];

    Photon.prototype.w = Canvas.width;

    Photon.prototype.h = Canvas.height;

    Photon.prototype.O = function() {
      return new Vector(0, 0);
    };

    function Photon(pos1, vel0, albedo, transmission, limit) {
      this.pos = pos1 != null ? pos1 : this.O();
      this.vel0 = vel0 != null ? vel0 : this.O();
      this.limit = limit != null ? limit : 0;
      this.velocity = [];
      this.setVelocities();
      this.d = 0;
      this.setState(0);
      this.setBounce(albedo, transmission);
    }

    Photon.prototype.setState = function(state) {
      this.state = state;
      if (this.state < 0) {
        return;
      }
      this.vel = this.velocity[this.state];
      this.color = this.colors[this.state];
      return this.size = this.sizes[this.state];
    };

    Photon.prototype.setBounce = function(albedo, transmission) {
      var X;
      X = Math.random();
      this.bounce = X < albedo;
      this.transmit = (albedo <= X && X < (albedo + transmission));
      return this.absorb = (albedo + transmission) <= X;
    };

    Photon.prototype.mod = function(albedo, transmission) {
      if (this.state === 0) {
        return this.setBounce(albedo, transmission);
      }
    };

    Photon.prototype.visible = function() {
      var ref, ref1;
      return ((0 < (ref = this.pos.x) && ref < this.w)) && ((0 < (ref1 = this.pos.y) && ref1 < this.h)) && this.vel.mag() > 0;
    };

    Photon.prototype.draw = function() {
      return Canvas.square(this.pos, this.size, this.color);
    };

    Photon.prototype.move = function() {
      if (this.collision() && this.state === 0) {
        if (this.bounce) {
          this.setState(1);
        }
        if (this.absorb) {
          this.setState(2);
        }
        if (this.transmit) {
          this.setState(3);
        }
      }
      this.d += this.vel.mag();
      return this.pos.add(this.vel);
    };

    return Photon;

  })();

  Sunlight = (function(superClass) {
    extend(Sunlight, superClass);

    function Sunlight() {
      return Sunlight.__super__.constructor.apply(this, arguments);
    }

    Sunlight.prototype.colors = ["#ff0", "#00f", "#000", "#000"];

    Sunlight.prototype.sizes = [2, 3, 3, 3];

    Sunlight.prototype.setVelocities = function() {
      var cy, rad, theta;
      rad = 100;
      cy = this.h / 2;
      this.velocity[0] = new Vector(this.vel0.x, this.vel0.y);
      theta = Math.asin((this.pos.y - cy) / rad);
      this.velocity[1] = (new Vector).polar(this.vel0.mag(), pi - 2 * theta);
      this.velocity[2] = this.O();
      this.velocity[3] = new Vector(this.vel0.x, this.vel0.y);
      return this.limit = this.w / 2 - Math.sqrt(rad * rad - (this.pos.y - cy) * (this.pos.y - cy));
    };

    Sunlight.prototype.collision = function() {
      return this.pos.x > this.limit;
    };

    return Sunlight;

  })(Photon);

  InfraredEarth = (function(superClass) {
    extend(InfraredEarth, superClass);

    function InfraredEarth() {
      return InfraredEarth.__super__.constructor.apply(this, arguments);
    }

    InfraredEarth.prototype.colors = ["#f00", "#f00", "#f00", "#f00"];

    InfraredEarth.prototype.sizes = [3, 3, 3, 3];

    InfraredEarth.prototype.setVelocities = function() {
      this.velocity[0] = new Vector(this.vel0.x, this.vel0.y);
      this.velocity[1] = this.O();
      this.velocity[2] = this.O();
      return this.velocity[3] = this.velocity[0];
    };

    InfraredEarth.prototype.collision = function() {
      return this.d > this.limit;
    };

    return InfraredEarth;

  })(Photon);

  InfraredAtmos = (function(superClass) {
    extend(InfraredAtmos, superClass);

    function InfraredAtmos() {
      return InfraredAtmos.__super__.constructor.apply(this, arguments);
    }

    InfraredAtmos.prototype.colors = ["#0f0", "#0f0", "#0f0", "#0f0"];

    InfraredAtmos.prototype.sizes = [4, 4, 4, 4];

    InfraredAtmos.prototype.setVelocities = function() {
      this.velocity[0] = new Vector(this.vel0.x, this.vel0.y);
      this.velocity[1] = this.O();
      this.velocity[2] = this.O();
      return this.velocity[3] = this.O();
    };

    InfraredAtmos.prototype.collision = function() {
      return this.d > this.limit;
    };

    return InfraredAtmos;

  })(Photon);

  Emitter = (function() {
    Emitter.prototype.maxPhotons = 4000;

    Emitter.prototype.rate = 0;

    Emitter.prototype.checked = true;

    Emitter.prototype.cy = Canvas.height / 2;

    function Emitter() {
      this.photons = [];
    }

    Emitter.prototype.mod = function(albedo1, transmission1) {
      var j, len, photon, ref, results;
      this.albedo = albedo1;
      this.transmission = transmission1;
      ref = this.photons;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        photon = ref[j];
        results.push(photon.mod(this.albedo, this.transmission));
      }
      return results;
    };

    Emitter.prototype.emit = function(albedo1, transmission1) {
      var j, k, len, photon, ref, ref1, results;
      this.albedo = albedo1;
      this.transmission = transmission1;
      if (!(this.photons.length > this.maxPhotons)) {
        for (j = 0, ref = this.rate; 0 <= ref ? j < ref : j > ref; 0 <= ref ? j++ : j--) {
          this.photons.push(this.emitPhoton());
        }
      }
      this.photons = this.photons.filter((function(_this) {
        return function(photon) {
          return photon.visible();
        };
      })(this));
      ref1 = this.photons;
      results = [];
      for (k = 0, len = ref1.length; k < len; k++) {
        photon = ref1[k];
        photon.move();
        if (this.checked) {
          results.push(photon.draw());
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    return Emitter;

  })();

  Sun = (function(superClass) {
    extend(Sun, superClass);

    Sun.prototype.x = 1;

    Sun.prototype.l = 200;

    function Sun() {
      this.velocity = new Vector(2, 0);
      Sun.__super__.constructor.call(this);
    }

    Sun.prototype.emitPhoton = function() {
      var pos;
      pos = new Vector(this.x, this.cy + this.l * (Math.random() - 0.5));
      return new Sunlight(pos, this.velocity, this.albedo, this.transmission);
    };

    return Sun;

  })(Emitter);

  Earth = (function(superClass) {
    extend(Earth, superClass);

    function Earth() {
      return Earth.__super__.constructor.apply(this, arguments);
    }

    Earth.prototype.R = 100;

    Earth.prototype.dist = Canvas.width / 2;

    Earth.prototype.emitPhoton = function() {
      var pos, surf, theta, vel;
      theta = Math.random() * 2 * pi;
      surf = (new Vector).polar(this.R, theta);
      pos = (new Vector(this.dist, this.cy)).add(surf);
      vel = (new Vector).polar(2, surf.ang());
      return new InfraredEarth(pos, vel, this.albedo, this.transmission, 50);
    };

    return Earth;

  })(Emitter);

  AtmosUp = (function(superClass) {
    extend(AtmosUp, superClass);

    function AtmosUp() {
      return AtmosUp.__super__.constructor.apply(this, arguments);
    }

    AtmosUp.prototype.R = 150;

    AtmosUp.prototype.dist = Canvas.width / 2;

    AtmosUp.prototype.emitPhoton = function() {
      var pos, surf, theta, vel;
      theta = Math.random() * 2 * pi;
      surf = (new Vector).polar(this.R, theta);
      pos = (new Vector(this.dist, this.cy)).add(surf);
      vel = (new Vector).polar(2, surf.ang());
      return new InfraredAtmos(pos, vel, this.albedo, this.transmission, 5000);
    };

    return AtmosUp;

  })(Emitter);

  AtmosDn = (function(superClass) {
    extend(AtmosDn, superClass);

    function AtmosDn() {
      return AtmosDn.__super__.constructor.apply(this, arguments);
    }

    AtmosDn.prototype.R = 150;

    AtmosDn.prototype.dist = Canvas.width / 2;

    AtmosDn.prototype.emitPhoton = function() {
      var pos, surf, theta, vel;
      theta = Math.random() * 2 * pi;
      surf = (new Vector).polar(this.R, theta);
      pos = (new Vector(this.dist, this.cy)).add(surf);
      vel = (new Vector).polar(2, surf.ang() + pi);
      return new InfraredAtmos(pos, vel, this.albedo, this.transmission, 50);
    };

    return AtmosDn;

  })(Emitter);

  Simulation = (function() {
    function Simulation() {
      this.sunValToRate = d3.scale.linear().rangeRound([0, 16]).domain([0, 2048]);
      this.fluxToRate = d3.scale.linear().rangeRound([0, 16]).domain([0, 500]);
      this.sun = new Sun;
      this.earth = new Earth;
      this.atmosUp = new AtmosUp;
      this.atmosDn = new AtmosDn;
      this.bars = new Chart;
      this.shell = new Shell;
      this.globe = new Globe;
      this.temperature = new Display;
      this.sunOn = new Checkbox("sunOn", (function(_this) {
        return function(v) {
          return _this.sun.checked = v;
        };
      })(this));
      this.earthOn = new Checkbox("earthOn", (function(_this) {
        return function(v) {
          return _this.earth.checked = v;
        };
      })(this));
      this.atmosOn = new Checkbox("atmosOn", (function(_this) {
        return function(v) {
          _this.atmosUp.checked = v;
          return _this.atmosDn.checked = v;
        };
      })(this));
      this.delayStart = (this.earth.dist - this.earth.R) / this.sun.velocity.mag();
      this.sunCounter = this.delayStart;
      this.albedo = new Slider("albedo", (function(_this) {
        return function(v) {
          return _this.sun.mod(v, 0);
        };
      })(this));
      this.insolation = new Slider("insolation", (function(_this) {
        return function(v) {
          _this.sun.rate = _this.sunValToRate(v);
          _this.nextInsol = v;
          return _this.sunCounter = _this.delayStart;
        };
      })(this));
      this.co2 = new Slider("co2", function(v) {
        return v;
      });
      this.setParams(1366, 0, 0, 'checked', 'checked', 'checked');
      this.sun.rate = this.sunValToRate(this.insolation.val());
      this.albedo.sliderDisp.html(this.albedo.val());
      this.insolation.sliderDisp.html(this.insolation.val());
      this.co2.sliderDisp.html(this.co2.val());
      this.insol = 0;
      this.nextInsol = this.insolation.val();
      this.si = 5.67e-8;
      this.C = 14;
      this.inSun = function(ap, S) {
        return 0.25 * (1 - ap) * S;
      };
      this.inAtmos = function(y, si, ep) {
        return si * (ep / 2) * y.pow(4);
      };
      this.outEarth = function(y, si) {
        return si * y.pow(4);
      };
      this.y = 0;
      this.h = 0.5;
      this.decimationCounter = 0;
    }

    Simulation.prototype.start = function() {
      if (!this.timer) {
        return this.animate();
      }
    };

    Simulation.prototype.snapshot = function() {
      var Iatmos, Iearth, Isun;
      Canvas.clear();
      if (this.sunCounter > 0) {
        this.sunCounter -= 1;
      }
      if (this.sunCounter === 0) {
        this.insol = this.nextInsol;
      }
      this.decimationCounter += 1;
      this.decimationCounter = this.decimationCounter % 5;
      if (this.decimationCounter === 0) {
        Isun = this.inSun(this.albedo.val(), this.insol);
        Iatmos = this.inAtmos(this.y, this.si, this.co2.val());
        Iearth = this.outEarth(this.y, this.si);
        this.y += this.h * 1 / this.C * (Isun - (Iearth - Iatmos));
        this.earth.rate = this.fluxToRate(Iearth);
        this.atmosUp.rate = this.fluxToRate(Iatmos);
        this.atmosDn.rate = this.fluxToRate(Iatmos);
        this.bars.val([Isun, Iearth - Iatmos]);
        this.shell.val([Iearth, Iatmos * 2]);
      }
      this.sun.emit(this.albedo.val(), 0);
      this.earth.emit(0, 1 - this.co2.val());
      this.atmosUp.emit(0, 0);
      this.atmosDn.emit(0, 0);
      return this.temperature.val(this.y - 273.15);
    };

    Simulation.prototype.animate = function() {
      if (this.timer) {
        return;
      }
      return this.timer = setInterval(((function(_this) {
        return function() {
          return _this.snapshot();
        };
      })(this)), 50);
    };

    Simulation.prototype.stop = function() {
      clearInterval(this.timer);
      return this.timer = null;
    };

    Simulation.prototype.setParams = function(ins, alb, eps, sun, earth, atmos) {
      $("#insolation").val(ins);
      $("#albedo").val(alb);
      $("#co2").val(eps);
      $("#sunOn").prop("checked", Boolean(sun)).trigger("change");
      $("#earthOn").prop("checked", Boolean(earth)).trigger("change");
      $("#atmosOn").prop("checked", Boolean(atmos)).trigger("change");
      $("#insolation").trigger("change");
      $("#albedo").trigger("change");
      return $("#co2").trigger("change");
    };

    return Simulation;

  })();

  Slider = (function() {
    function Slider(id1, change) {
      this.id = id1;
      this.change = change;
      this.slider = $("#" + this.id);
      this.sliderDisp = $("#" + this.id + "-value");
      this.slider.unbind();
      this.slider.on("input change", (function(_this) {
        return function() {
          var val;
          val = _this.val();
          _this.change(val);
          return _this.sliderDisp.html(val);
        };
      })(this));
    }

    Slider.prototype.val = function() {
      return Number(this.slider.val());
    };

    return Slider;

  })();

  Checkbox = (function() {
    function Checkbox(id1, change) {
      this.id = id1;
      this.change = change;
      this.checkbox = $("#" + this.id);
      this.checkbox.unbind();
      this.checkbox.on("change", (function(_this) {
        return function() {
          var val;
          val = _this.val();
          return _this.change(val);
        };
      })(this));
    }

    Checkbox.prototype.val = function() {
      return this.checkbox.is(":checked");
    };

    return Checkbox;

  })();

  sim = new Simulation;

  $("#params1").on("click", (function(_this) {
    return function() {
      sim.stop();
      sim = new Simulation;
      sim.start();
      return $("#params4b").text("Pause animation");
    };
  })(this));

  $("#params2a").on("click", (function(_this) {
    return function() {
      return sim.setParams(1366, 0.3, 0, "checked", "checked", "checked");
    };
  })(this));

  $("#params3").on("click", (function(_this) {
    return function() {
      return sim.setParams(1366, 0.3, 0.78, "checked", "checked", "checked");
    };
  })(this));

  $("#params4").on("click", (function(_this) {
    return function() {
      return sim.setParams(1366, 0.3, 0.82, "checked", "checked", "checked");
    };
  })(this));

  $("#params4b").on("click", (function(_this) {
    return function() {
      if (sim.timer) {
        sim.stop();
        return $("#params4b").text("Resume animation");
      } else {
        sim.start();
        return $("#params4b").text("Pause animation");
      }
    };
  })(this));

  sim.start();

}).call(this);
