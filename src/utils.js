function generatorToList(generator) {
    let list = [];
    
    for (var element of generator) {
        list.push(element);
    }

    return list;
}

const TEXT_NODE = 3
function* getTextNodes(node) {
    if (node.childNodes.length == 0) {
        if (node.nodeType == TEXT_NODE) {
            yield node;
        }
    }
    else {
        for (var childNode of node.childNodes) {
            yield* getTextNodes(childNode);
        }
    }
}

function getStyleFromOpinionLevel(opinionLevel) {
    let styleBase = 'color:';

    if (opinionLevel < 3) {
        return styleBase.concat('black');
    } else if (opinionLevel < 6) {
        return styleBase.concat('gray');
    } else {
        return styleBase.concat('lightgrey');
    }
}

function createMarkNode(document, opinionLevel) {
    const opinologo = document.createAttribute("tag-opinologo");
    opinologo.value = opinionLevel;

    const mark = document.createElement('span');
    mark.setAttributeNode(opinologo);

    return mark;
}

function transformNewsNodes(textNodes, sentencesOpinionLevel) {
    var isentence = 0;
    var remaning = sentencesOpinionLevel[isentence].sentenceLength;

    for (const textNode of textNodes) {
        let remainingTextNode = textNode;

        while (remainingTextNode.nodeValue.length >= remaning) {
            let newRemaining = remainingTextNode.splitText(remaning);
            let textSentence = remainingTextNode;
            remainingTextNode = newRemaining;

            const mark = createMarkNode(textNode.ownerDocument,
                sentencesOpinionLevel[isentence].opinionLevel);
                
            mark.appendChild(textSentence.cloneNode());
            textSentence.parentNode.replaceChild(mark, textSentence);


            if (++isentence >= sentencesOpinionLevel.length)
                return;

            remaning = sentencesOpinionLevel[isentence].sentenceLength;
        }

        if (remainingTextNode.nodeValue.length > 0) {
            const mark = createMarkNode(textNode.ownerDocument,
                sentencesOpinionLevel[isentence].opinionLevel);

            mark.appendChild(remainingTextNode.cloneNode());
            remainingTextNode.parentNode.replaceChild(mark, remainingTextNode);
            remaning -= remainingTextNode.nodeValue.length;
        }
    }
}

export { getTextNodes, transformNewsNodes, getStyleFromOpinionLevel, generatorToList }