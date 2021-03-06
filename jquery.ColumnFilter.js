/*
 * Copyright (c) 2012 David Kindler (davidkindler.com)
 * This is licensed under GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
/* * 
 *
 * @name ColumnFilter
 * @type jQuery
 * @param Object settings;
 *			alternateRowClassNames	:	Alternating class names for each row after filtering. Maximum of two items.
 *
 * Table is composed of thead and tbody.  By default all columns will have text filter.  
 * If you want a drop down list add "filter-type" attribute to th cell and set to ddl. eg. <th filter-type="ddl"> 
 * If you do not want column to be filtered add "filter-type" attribute to th cell and set to none. eg. <th filter-type="none"> 
 *
 * @author David Kindler (davidkindler.com)
 * @version 0.9.0
 */

(function($) {
  $.fn.ColumnFilter = function(options) {
    var settings = $.extend({alternateRowClassNames:[]}, options);
    var numCols = $(this).find("tr")[0].cells.length, evenRow = settings.alternateRowClassNames[0] || "", oddRow = settings.alternateRowClassNames[1] || "";
    Array.prototype.unique = function() {
      var o = {}, i, l = this.length, r = [];
      for(i = 0;i < l;i += 1) {
        o[this[i]] = this[i]
      }
      for(i in o) {
        r.push(o[i])
      }
      return r
    };
    return this.each(function() {
      var obj = $(this);
      var filter = function(selector, query, f) {
        $(selector, obj).each(function() {
          $(this).text().search(new RegExp(query, "i")) < 0 ? $(this).attr("data-value", 0) : $(this).attr("data-value", 1);
          sum = 0;
          sum += parseInt($(this).attr("data-value"));
          $(this).siblings().each(function() {
            sum += parseInt($(this).attr("data-value"))
          });
          if(sum < numCols) {
            $(this).parent(this).hide()
          }else {
            $(this).parent(this).show()
          }
        });
        if(typeof f == "function") {
          f(obj)
        }
      };
      var inputFilter = function(column) {
        $("#Col" + column, obj).empty().wrapInner('<input type="text" id="filterText' + column + '" class="filterText">');
        $("#filterText" + column, obj).keyup(function(event) {
          filter("tbody tr td:nth-child(" + column + ")", $(this).val(), alternateRows)
        })
      };
      var selectFilter = function(column) {
        $("#Col" + column, obj).empty().wrapInner('<select id="filterText' + column + '" class="filterText">');
        setupSelectFilter(column);
        $("#filterText" + column, obj).change(function(event) {
          filter("tbody tr td:nth-child(" + column + ")", $(this).val(), alternateRows)
        })
      };
      var setupSelectFilter = function(column) {
        var items = [], Uoptions = [];
        $("tbody>tr", obj).each(function() {
          str = $.trim($(this).find("td:nth-child(" + column + ")", this).text());
          if(str.length) {
            items.push(str)
          }
        });
        var Uitems = items.unique();
        Uitems.unshift("");
        $.each(Uitems, function(i, item) {
          Uoptions.push('<option value="' + item + '">' + item + "</option>")
        });
        $("#filterText" + column, obj).empty().append(Uoptions.join(""))
      };
      var alternateRows = function(obj) {
        if(settings.alternateRowClassNames && settings.alternateRowClassNames.length) {
          $("tbody>tr:visible:even", obj).removeClass(oddRow).removeClass(evenRow).addClass(evenRow);
          $("tbody tr:visible:odd", obj).removeClass(oddRow).removeClass(evenRow).addClass(oddRow)
        }
      };
      $("thead", obj).append('<tr class="filterColumns" />');
      for(i = 1;i <= numCols;i++) {
        $(".filterColumns", obj).append('<td id="Col' + i + '">')
      }
      for(i = 0;i <= numCols;i++) {
        if($("thead th:eq(" + i + ")", obj).attr("filter-type") != "none") {
          $("thead th:eq(" + i + ")", obj).attr("filter-type") == "ddl" ? selectFilter(i + 1) : inputFilter(i + 1)
        }
      }
      $("tbody tr td", obj).attr("data-value", 1);
      alternateRows(obj)
    })
  }
})(jQuery);