String.prototype.replaces = function (a, b) {
	return this.replace(a, b);
};
String.prototype.replaceAll = function (de, para) {
	var str = this;
	var pos = str.indexOf(de);
	while (pos > -1) {
		str = str.replace(de, para);
		pos = str.indexOf(de);
	}
	return (str);
};
String.prototype.contains = function (a) {
	if (this.indexOf(a) > -1)
		return true;
	else
		return false;
};