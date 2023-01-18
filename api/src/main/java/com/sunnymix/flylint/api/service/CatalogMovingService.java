package com.sunnymix.flylint.api.service;

import com.sunnymix.flylint.api.gateway.dao.wiki.CatalogDao;
import com.sunnymix.flylint.api.model.catalog.Catalog;
import com.sunnymix.flylint.api.model.wiki.DescendantPath;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.sunnymix.flylint.api.model.catalog.MoveCatalog.*;

/**
 * @author sunnymix
 */
@Service
public class CatalogMovingService {

    @Autowired
    private CatalogDao catalogDao;

    @Transactional
    public void move(String name, String toName, String place) {
        var catalogOpt = catalogDao.one(name);
        if (catalogOpt.isEmpty()) {
            return;
        }

        var catalog = catalogOpt.get();

        var toCatalogOpt = catalogDao.one(toName);
        if (toCatalogOpt.isEmpty()) {
            return;
        }

        var toCatalog = toCatalogOpt.get();

        if (place.equals(CHILD_PLACE)) {
            new MoveToChild(catalogDao, catalog, toCatalog).process();
        }

        if (place.equals(NEXT_PLACE)) {
            new MoveToNext(catalogDao, catalog, toCatalog).process();
        }

        if (place.equals(PREVIOUS_PLACE)) {
            new MoveToPrevious(catalogDao, catalog, toCatalog).process();
        }
    }

    private abstract static class MoveProcessor {

        protected final CatalogDao dao;
        protected final Catalog me;
        protected final Catalog target;

        protected String descendantPath;
        protected String descendantNewPath;

        protected String oldSiblingPath;
        protected Integer oldSiblingPathIndexStart;

        protected String newSiblingPath;
        protected Integer newSiblingPathIndexStart;

        protected String newPath;
        protected Integer newPathIndex;

        public MoveProcessor(CatalogDao dao, Catalog me, Catalog target) {
            this.dao = dao;
            this.me = me;
            this.target = target;
        }

        public void process() {
            // 逻辑：先在目标路径中腾出空间，然后再移动过去
            decreasePathIndexOfMyOldSibling();
            increasePathIndexOfMyNewSibling();
            moveMeToNewPath();
            moveMyDescendantToNewPath();
        }

        private void decreasePathIndexOfMyOldSibling() {
            dao.decreaseSiblingPathIndex(oldSiblingPath, oldSiblingPathIndexStart);
        }

        private void increasePathIndexOfMyNewSibling() {
            dao.increaseSiblingPathIndex(newSiblingPath, newSiblingPathIndexStart);
        }

        private void moveMeToNewPath() {
            dao.moveToNewPath(me.getName(), newPath, newPathIndex);
        }

        private void moveMyDescendantToNewPath() {
            dao.moveDescendantToNewPath(descendantPath, descendantNewPath);
        }

    }

    private static class MoveToChild extends MoveProcessor {
        public MoveToChild(CatalogDao dao, Catalog me, Catalog target) {
            super(dao, me, target);

            this.newPath = DescendantPath.of(target.getPath(), target.getName()).value();
            this.newPathIndex = 0;

            this.newSiblingPath = this.newPath;
            this.newSiblingPathIndexStart = 0;

            this.descendantPath = DescendantPath.of(me.getPath(), me.getName()).value();
            this.descendantNewPath = DescendantPath.of(this.newPath, me.getName()).value();

            this.oldSiblingPath = me.getPath();
            this.oldSiblingPathIndexStart = me.getPathIndex() + 1;

        }
    }

    private static class MoveToNext extends MoveProcessor {
        public MoveToNext(CatalogDao dao, Catalog me, Catalog target) {
            super(dao, me, target);

            this.newPath = target.getPath();
            this.newPathIndex = target.getPathIndex() + 1;

            this.newSiblingPath = this.newPath;
            this.newSiblingPathIndexStart = target.getPathIndex() + 1;

            this.descendantPath = DescendantPath.of(me.getPath(), me.getName()).value();
            this.descendantNewPath = DescendantPath.of(this.newPath, me.getName()).value();

            this.oldSiblingPath = me.getPath();
            this.oldSiblingPathIndexStart = me.getPathIndex() + 1;
        }
    }

    private static class MoveToPrevious extends MoveProcessor {
        public MoveToPrevious(CatalogDao dao, Catalog me, Catalog target) {
            super(dao, me, target);

            this.newPath = target.getPath();
            this.newPathIndex = target.getPathIndex();

            this.descendantPath = DescendantPath.of(me.getPath(), me.getName()).value();
            this.descendantNewPath = DescendantPath.of(this.newPath, me.getName()).value();

            this.oldSiblingPath = me.getPath();
            this.oldSiblingPathIndexStart = me.getPathIndex() + 1;

            this.newSiblingPath = newPath;
            this.newSiblingPathIndexStart = target.getPathIndex();
        }
    }

}
